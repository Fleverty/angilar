import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
	ShipmentNotification,
	ShipmentNotificationProduct,
} from "@helper/abstraction/shipment-notification";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notifications-view-products",
	templateUrl: "./shipment-notification-view-products.component.html",
	styleUrls: ["./shipment-notification-view-products.component.scss"]
})
export class ShipmentNotificationViewProductsComponent {
	@Input() public readonly products?: ShipmentNotificationProduct[];
	@Input() public document?: ShipmentNotification;
	public showContent = true;
}
