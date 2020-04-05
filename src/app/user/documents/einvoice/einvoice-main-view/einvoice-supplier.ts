import { EinvoiceMainView } from "./einvoice-main-view";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { EinvoiceState } from "../einvoice.reducer";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { TranslationService } from "@core/translation.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

export abstract class EinvoiceSupplier extends EinvoiceMainView {

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
	}
}
