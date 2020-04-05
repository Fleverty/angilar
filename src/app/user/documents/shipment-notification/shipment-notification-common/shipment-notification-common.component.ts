import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-common",
	templateUrl: "./shipment-notification-common.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-common.component.scss"]
})
export class ShipmentNotificationCommonComponent {
	@Input() public form?: FormGroup;
}
