import { DraftType } from "@helper/abstraction/draft";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { filter, takeUntil } from "rxjs/operators";
import * as EwaybillActions from "@app/user/documents/ewaybill/ewaybill.actions";
import { EwaybillState } from "@app/user/documents/ewaybill/ewaybill.reducer";
import { Subject, Observable } from "rxjs";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { exportXMLDocuments, exportXLSXDocuments } from "@app/user/user.actions";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { OnDestroy } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";

export class EwaybillView implements OnDestroy {
	public get ewaybill(): Ewaybill {
		return this.activatedRoute.snapshot.data.document;
	}

	public get type(): DraftType {
		return this.activatedRoute.snapshot.params.type;
	}

	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	protected unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		protected readonly activatedRoute: ActivatedRoute,
		protected readonly store: Store<EwaybillState>,
		protected readonly ewaybillSelectorService: EwaybillSelectorService,
		protected readonly overlayService: OverlayService,
		protected readonly translationService: TranslationService,
		protected readonly actions: Actions,
		protected readonly router: Router
	) {
		this.selectError$<boolean>(state => state.statusOfCheckSign).subscribe(value => {
			this.getCheckSignMessage(value);
			this.store.dispatch(EwaybillActions.resetStatusOfCheckSign());
		});

		this.selectError$<HttpErrorResponse | Error>(state => state.confirmationError).subscribe(err => {
			this.getConfirmErrorMessage(err);
			this.store.dispatch(EwaybillActions.resetConfirmError());
		});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.overlayService.clear();
		this.store.dispatch(EwaybillActions.resetEwaybill());
		this.store.dispatch(EwaybillActions.resetStatusOfCheckSign());
	}

	public exportXML(): void {
		this.store.dispatch(exportXMLDocuments({
			documentType: this.type,
			documentIds: [+this.id]
		}));
	}

	public exportXSLX(): void {
		this.store.dispatch(exportXLSXDocuments({
			documentType: "EWAYBILL",
			documentIds: [+this.id]
		}));
	}

	public check(): void {
		this.store.dispatch(EwaybillActions.checkSign({
			documentType: this.type,
			documentId: this.id
		}));
	}

	public getCheckSignMessage(value?: boolean): void {
		if (value) {
			const message: string = this.translationService.getTranslation("checkSignOK");
			this.overlayService.showNotification$(message, "success");
		} else {
			const message: string = this.translationService.getTranslation("checkSignError");
			this.overlayService.showNotification$(message, "error");
		}
	}

	public getConfirmErrorMessage(err?: HttpErrorResponse | Error): void {
		let defaultErrorMessage = this.translationService.getTranslation("defaultError");
		if (err && err instanceof HttpErrorResponse) {
			switch (err.status) {
				case 422:
					defaultErrorMessage = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
					break;
				case 0:
					defaultErrorMessage = this.translationService.getTranslation("proxyUnavailable") || defaultErrorMessage;
					break;
				default:
					defaultErrorMessage = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
					break;
			}
		}
		this.overlayService.showNotification$(defaultErrorMessage, "error");
	}

	private selectError$<T>(fn: (state: EwaybillState) => T | undefined): Observable<T | undefined> {
		return this.ewaybillSelectorService.select$(fn).pipe(
			filter(e => e !== undefined),
			takeUntil(this.unsubscribe$$)
		);
	}
}
