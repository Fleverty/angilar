import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { Einvoice } from "@helper/abstraction/einvoice";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { TranslationService } from "@core/translation.service";
import { EinvoiceBuyer } from "../einvoice-main-view/einvoice-buyer";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-outbox-created",
	templateUrl: "./einvoice-outbox-created.component.html",
	styleUrls: ["./einvoice-outbox-created.component.scss"]
})

export class EinvoiceOutboxCreatedComponent extends EinvoiceBuyer {
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
		this.userRoutingService.navigateBack();
	}
}
