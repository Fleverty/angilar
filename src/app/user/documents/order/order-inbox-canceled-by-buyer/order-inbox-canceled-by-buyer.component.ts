import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersState } from "../orders.reducer";
import { Store } from "@ngrx/store";
import { OrderSupplier } from "../order-view/order-supplier";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order-inbox-canceled-by-buyer",
	templateUrl: "./order-inbox-canceled-by-buyer.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInboxCanceledByBuyerComponent extends OrderSupplier {
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
		this.router.navigate(["user", "documents", "ORDERS", documentState.incoming]);
	}
}
