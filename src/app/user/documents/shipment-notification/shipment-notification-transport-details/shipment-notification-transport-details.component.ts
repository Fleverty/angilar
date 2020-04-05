import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-transport-details",
	templateUrl: "./shipment-notification-transport-details.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-transport-details.component.scss"]
})
export class ShipmentNotificationTransportDetailsComponent {
	@Input() public readonly form?: FormGroup;
}
