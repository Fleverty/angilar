import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-receiver",
	templateUrl: "./einvoicepmt-receiver.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-receiver.component.scss"]
})
export class EinvoicepmtReceiverComponent {
	@Input() public form?: FormGroup;
	@Output() public readonly fillWithBuyer: EventEmitter<void> = new EventEmitter<void>();
}
