import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersState } from "../orders.reducer";
import { Store, } from "@ngrx/store";
import { OrderSupplier } from "../order-view/order-supplier";
import { documentState } from "@helper/paths";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";

@Component({
	selector: "app-order-outbox-accepted-with-changes",
	templateUrl: "./order-outbox-accepted-with-changes.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderOutboxAcceptedWithChangesComponent extends OrderSupplier {
	constructor(
		router: Router,
		activatedRoute: ActivatedRoute,
		store: Store<OrdersState>,
		overlayService: OverlayService,
		actions: Actions
	) {
		super(activatedRoute, store, router, overlayService, actions);
	}

	public prevPage(): void {
		this.router.navigate(["user", "documents", "ORDERS", documentState.outgoing]);
	}
}
