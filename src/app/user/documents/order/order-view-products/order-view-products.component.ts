import { Component, ChangeDetectionStrategy, Input, OnChanges } from "@angular/core";
import { OrderProduct, Order } from "@helper/abstraction/order";
import { OrderViewService } from "../order-view.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order-view-products",
	templateUrl: "./order-view-products.component.html",
	styleUrls: ["./order-view-products.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderViewProductsComponent implements OnChanges {
	public products$?: Observable<OrderProduct[]>;
	public type$?: Observable<"ORDERS" | "ORDRSP">;
	@Input() public order?: Order;
	@Input() public status: documentState.incoming | documentState.outgoing = documentState.incoming;

	constructor(private orderViewService: OrderViewService) { }

	public ngOnChanges(): void {
		const order = this.order;
		if (order) {
			this.type$ = this.orderViewService.getDocumentViewType$(order.supplierGln, this.status);
			this.products$ = this.type$.pipe(
				map(type => this.getProducts(type, order))
			);
		}
	}

	private getProducts(messageType: "ORDERS" | "ORDRSP", order: Order): OrderProduct[] {
		if (!order) {
			return [];
		} else if (messageType === "ORDERS") {
			return order.msgOrdersItems || [];
		} else {
			return order.responseDocument && order.responseDocument.msgOrdrspItems || [];
		}
	}
}
