import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { Subject } from "rxjs";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { EinvoiceBuyer } from "../einvoice-main-view/einvoice-buyer";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-outbox-canceled",
	templateUrl: "./einvoice-outbox-canceled.component.html",
	styleUrls: ["./einvoice-outbox-canceled.component.scss"]
})

export class EinvoiceOutboxCanceledComponent extends EinvoiceBuyer {
	protected unsubscribe$$ = new Subject<void>();
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
