import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-recipient",
	templateUrl: "./shipment-notification-recipient.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-recipient.component.scss"]
})
export class ShipmentNotificationRecipientComponent {
	@Input() public readonly form?: FormGroup;
}
