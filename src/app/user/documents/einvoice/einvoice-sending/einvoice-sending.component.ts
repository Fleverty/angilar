import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EinvoiceSignDraftComponent } from "../einvoice-sign-draft/einvoice-sign-draft.component";
import { Actions } from "@ngrx/effects";
import { EinvoiceState } from "../einvoice.reducer";

@Component({
	selector: "app-einvoice-sending",
	templateUrl: "./einvoice-sending.component.html",
	styleUrls: ["./einvoice-sending.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceSendingComponent extends EinvoiceSignDraftComponent {
	constructor(
		actions: Actions,
		store: Store<EinvoiceState>,
		activatedRoute: ActivatedRoute,
		router: Router,
		userRoutingService: UserRoutingService,
		overlayService: OverlayService,
	) {
		super(actions, store, activatedRoute, router, userRoutingService, overlayService);
	}
}
