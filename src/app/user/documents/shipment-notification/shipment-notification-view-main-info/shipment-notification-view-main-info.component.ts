import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ShipmentNotification } from "@helper/abstraction/shipment-notification";
import { ShipmentNotificationStatusService } from "../shipment-notification-status.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-view-main-info",
	templateUrl: "./shipment-notification-view-main-info.component.html",
	styleUrls: ["./shipment-notification-view-main-info.component.scss"]
})
export class ShipmentNotificationViewMainInfoComponent {
	@Input() public readonly draft?: ShipmentNotification;

	constructor(
		public readonly shipmentNotificationStatusService: ShipmentNotificationStatusService
	) { }
}
