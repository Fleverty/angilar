import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { ActivatedRoute } from "@angular/router";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { createSelector, select, Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import * as EinvoicepmtActions from "../einvoicepmt-store/einvoicepmt.actions";
import { skip, take, takeUntil } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { EinvoicepmtFormIncoming } from "@app/user/documents/einvoicepmt/einvoicepmt-form/einvoicepmt-form-incoming";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-incoming-transferred",
	templateUrl: "./einvoicepmt-incoming-transferred.component.html",
	styleUrls: ["./einvoicepmt-incoming-transferred.component.scss"]
})
export class EinvoicepmtIncomingTransferredComponent extends EinvoicepmtFormIncoming implements OnDestroy {
	public get document(): EinvoicepmtDto {
		return this.activatedRoute.snapshot.data.document;
	}
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		protected readonly userRoutingService: UserRoutingService,
		protected readonly store: Store<EinvoicepmtState>,
		protected readonly overlayService: OverlayService,
		protected readonly translationService: TranslationService
	) {
		super(store, overlayService, userRoutingService, translationService);
	}

	public confirm(): void {
		const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectConfirmationError = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): HttpErrorResponse | Error | undefined => state.confirmationError);
		this.store.pipe(select(selectConfirmationError)).pipe(
			skip(1),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(
			err => {
				let m = "";
				if (err && err instanceof HttpErrorResponse)
					switch (err.status) {
						case 422:
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
							break;
						case 0:
							m = this.translationService.getTranslation("proxyUnavailable") || m;
							break;
						default:
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
							break;
					}
				this.overlayService.showNotification$(m, "error");
			}
		);
		if (this.document && this.id) {
			this.store.dispatch(EinvoicepmtActions.confirmEinvoicepmtReceipt(+this.id));
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
