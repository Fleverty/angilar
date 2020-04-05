import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-responsible-persons-details",
	templateUrl: "./shipment-notification-responsible-persons-details.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-responsible-persons-details.component.scss"]
})
export class ShipmentNotificationResponsiblePersonsDetailsComponent {
	@Input() public readonly form?: FormGroup;
}
