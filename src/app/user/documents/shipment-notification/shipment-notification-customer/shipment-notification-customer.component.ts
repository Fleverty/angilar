import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-customer",
	templateUrl: "./shipment-notification-customer.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-customer.component.scss"]
})
export class ShipmentNotificationCustomerComponent {
	@Input() public readonly form?: FormGroup;

	@Output() public fillWith: EventEmitter<"PROVIDER" | "CUSTOMER"> = new EventEmitter<"PROVIDER" | "CUSTOMER">();
}
