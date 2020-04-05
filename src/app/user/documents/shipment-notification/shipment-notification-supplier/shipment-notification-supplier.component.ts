import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-supplier",
	templateUrl: "./shipment-notification-supplier.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-supplier.component.scss"]
})
export class ShipmentNotificationSupplierComponent {
	@Input() public form?: FormGroup;
}
