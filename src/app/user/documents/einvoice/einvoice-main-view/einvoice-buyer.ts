import { EinvoiceMainView } from "./einvoice-main-view";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { EinvoiceState } from "../einvoice.reducer";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { TranslationService } from "@core/translation.service";
import { Einvoice } from "@helper/abstraction/einvoice";
import { HttpErrorResponse } from "@angular/common/http";
import { skip, take, takeUntil, first } from "rxjs/operators";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import * as EinvoiceCancel from "./../einvoice-actions/einvoice-cancel.actions";
import { Observable } from "rxjs";

export abstract class EinvoiceBuyer extends EinvoiceMainView {
	public cancelingStatus$: Observable<"ERROR" | "PENDING" | "OK" | undefined>;

	constructor(
		userRoutingService: UserRoutingService,
		activatedRoute: ActivatedRoute,
		store: Store<EinvoiceState>,
		router: Router,
		overlayService: OverlayService,
		actions: Actions,
		einvoiceSelectorService: EinvoiceSelectorService,
		translationService: TranslationService,
	) {
		super(userRoutingService, activatedRoute, store, overlayService, actions, router, einvoiceSelectorService, translationService);
		this.cancelingStatus$ = this.einvoiceSelectorService.select$(state => state.cancelingStatus);
	}

	public cancel(einvoice: Einvoice): void {
		if (einvoice.id) {
			this.einvoiceSelectorService.select$(state => state.cancelingError).pipe(
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
			).subscribe(() => this.userRoutingService.navigateBack());

			this.store.dispatch(EinvoiceCancel.cancelEinvoice(einvoice.id.toString()));
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
}
