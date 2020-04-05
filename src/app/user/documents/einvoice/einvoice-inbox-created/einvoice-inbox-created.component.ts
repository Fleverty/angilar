import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Router, ActivatedRoute } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { TranslationService } from "@core/translation.service";
import { Einvoice } from "@helper/abstraction/einvoice";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { documentState } from "@helper/paths";
import { EinvoiceSupplier } from "../einvoice-main-view/einvoice-supplier";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	selector: "app-einvoice-inbox-created",
	templateUrl: "./einvoice-inbox-created.component.html",
	styleUrls: ["./einvoice-inbox-created.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceInboxCreatedComponent extends EinvoiceSupplier {
	public get einvoice(): Einvoice {
		return this.activatedRoute.snapshot.data.document;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}

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
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EINVOICE", documentState.incoming]);
	}
}
