import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { OrdersState } from "../orders.reducer";
import { OrderBuyer } from "../order-view/order-buyer";
import { documentState } from "@helper/paths";
import { OrderViewService } from "../order-view.service";

@Component({
	selector: "app-order-inbox-accepted",
	templateUrl: "./order-inbox-accepted.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInboxAcceptedComponent extends OrderBuyer {
	constructor(
		router: Router,
		activatedRoute: ActivatedRoute,
		store: Store<OrdersState>,
		orderViewService: OrderViewService
	) {
		super(activatedRoute, store, router, orderViewService);
	}

	public prevPage(): void {
		this.router.navigate(["user", "documents", "ORDERS", documentState.incoming]);
	}
}
