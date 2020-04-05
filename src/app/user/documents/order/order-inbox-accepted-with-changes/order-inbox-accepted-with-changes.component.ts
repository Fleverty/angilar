import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersState } from "../orders.reducer";
import { Store } from "@ngrx/store";
import { OrderBuyer } from "../order-view/order-buyer";
import { OrderViewService } from "../order-view.service";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order-inbox-accepted-with-changes",
	templateUrl: "./order-inbox-accepted-with-changes.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInboxAcceptedWithChangesComponent extends OrderBuyer {
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
