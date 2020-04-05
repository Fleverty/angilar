import { Component, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Subject, Observable } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { documentState } from "@helper/paths";
import { TranslationService } from "@core/translation.service";
import { Einvoice } from "@helper/abstraction/einvoice";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSupplier } from "../einvoice-main-view/einvoice-supplier";
import { signEinvocieResponse, saveResponseSignedEinvoiceSuccess } from "../einvoice-actions/einvoice-response.actions";
import { HttpErrorResponse } from "@angular/common/http";
import { skip, take, takeUntil } from "rxjs/operators";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EinvoiceEditPopupComponent } from "../einvoice-edit-popup/einvoice-edit-popup.component";
import { OverlayComponent } from "@shared/overlay/overlay.component";

@Component({
	selector: "app-einvoice-inbox-transferred",
	templateUrl: "./einvoice-inbox-transferred.component.html",
	styleUrls: ["./einvoice-inbox-transferred.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceInboxTransferredComponent extends EinvoiceSupplier {
	public get einvoice(): Einvoice {
		return this.activatedRoute.snapshot.data.document;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR" | undefined>;
	protected unsubscribe$$ = new Subject<void>();
	@ViewChild("editPopup", { static: false }) private overlayComponent?: OverlayComponent;
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
		super(userRoutingService, activatedRoute, store, router, overlayService, actions, einvoiceSelectorService, translationService);

		const selectFn$ = this.einvoiceSelectorService.select$.bind(this.einvoiceSelectorService);
		this.signingStatus$ = selectFn$(state => state.signingStatus);
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EINVOICE", documentState.incoming]);
	}

	public processSignThenSend(): void {
		this.store.dispatch(signEinvocieResponse(+this.id));

		this.actions.pipe(
			ofType(saveResponseSignedEinvoiceSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.goBack());

		const errors$ = this.einvoiceSelectorService.select$((state: EinvoiceState): HttpErrorResponse | Error | undefined => state.signingError);
		errors$.pipe(skip(1), take(1), takeUntil(this.unsubscribe$$)).subscribe(
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
	}

	public edit(): void {
		if (!this.id)
			throw Error("No id");
		if (!this.overlayComponent) {
			throw Error("No overlay component");
		}

		const component = this.overlayComponent.show(EinvoiceEditPopupComponent, { inputs: { id: this.id }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayComponent && this.overlayComponent.destroy());
	}
}
