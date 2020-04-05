import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { OrderStatusService } from "../order-status.service";
import { Order } from "@helper/abstraction/order";

@Component({
	selector: "app-order-view-main-info",
	templateUrl: "./order-view-main-info.component.html",
	styleUrls: ["./order-view-main-info.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderViewMainInfoComponent {
	@Input() public order?: Order;

	constructor(
		public readonly orderStatusService: OrderStatusService,
	) { }
}
