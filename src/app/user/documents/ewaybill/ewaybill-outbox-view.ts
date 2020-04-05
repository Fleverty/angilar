
import { Store } from "@ngrx/store";
import { EwaybillState } from "./ewaybill.reducer";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { EwaybillSelectorService } from "./ewaybill-selector.service";
import { Observable, Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { skip, take, first, takeUntil } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import * as CancelEwaybillActions from "./ewaybill-cancel/ewaybill-cancel.actions";

export abstract class EwaybillOutboxView {
	public cancelingStatus$: Observable<"ERROR" | "PENDING" | "OK" | undefined>;
	public signingStatus$: Observable<"ERROR" | "PENDING" | "OK" | undefined>;
	public unsubscribe$$ = new Subject<void>();

	constructor(
		protected readonly ewaybillSelectorService: EwaybillSelectorService,
		protected readonly overlayService: OverlayService,
		protected readonly store: Store<EwaybillState>,
		protected readonly translationService: TranslationService
	) {
		this.cancelingStatus$ = this.ewaybillSelectorService.select$(state => state.cancelingStatus);
		this.signingStatus$ = this.ewaybillSelectorService.select$(state => state.signingStatus);
	}

	public cancel(ewaybill: Ewaybill): void {
		if (ewaybill.id && ewaybill.msgType) {
			this.ewaybillSelectorService.select$(state => state.cancelError).pipe(
				skip(1),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(e => {
				if (e instanceof HttpErrorResponse) {
					this.cancelErrorHandler(e);
				}
			});

			this.cancelingStatus$.pipe(
				skip(1),
				first(status => status === "OK"),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => this.goBack());

			this.store.dispatch(CancelEwaybillActions.getSignedAndCanceledDraftThenSaveDraft({
				draftType: ewaybill.msgType,
				document: ewaybill,
				documentId: ewaybill.id.toString()
			}));
		}
	}

	private cancelErrorHandler(error: HttpErrorResponse): void {
		let errorMessage: string;
		const proxyUnavailableMessage = this.translationService.getTranslation("proxyUnavailable");
		switch (true) {
			case error.status === 422:
				errorMessage = error.error && typeof error.error.error === "string" ? error.error.error : error.error.message;
				break;
			case error.status === 0 && !!proxyUnavailableMessage:
				errorMessage = proxyUnavailableMessage;
				break;
			default:
				errorMessage = error.error && typeof error.error.error === "string" ? error.error.error : error.message;
				break;
		}

		this.overlayService.showNotification$(errorMessage, "error");
	}


	public abstract goBack(): void;
}
