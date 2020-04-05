import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { OrdersState } from "../orders.reducer";
import { OrderSupplier } from "../order-view/order-supplier";
import { OverlayService } from "@core/overlay.service";
import { Actions } from "@ngrx/effects";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order-inbox-transferred",
	templateUrl: "./order-inbox-transferred.component.html",
	styleUrls: ["../order-view.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInboxTransferredComponent extends OrderSupplier {
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
