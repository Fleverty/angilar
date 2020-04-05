import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersState } from "../orders.reducer";
import { Store } from "@ngrx/store";
import { OrderSupplier } from "../order-view/order-supplier";
import { documentState } from "@helper/paths";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";

@Component({
	selector: "app-order-outbox-canceled-by-supplier",
	templateUrl: "./order-outbox-canceled-by-supplier.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderOutboxCanceledBySupplierComponent extends OrderSupplier {
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
