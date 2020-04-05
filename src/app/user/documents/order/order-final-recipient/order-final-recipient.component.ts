import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-order-final-recipient",
	templateUrl: "./order-final-recipient.component.html",
	styleUrls: ["../form.scss", "./order-final-recipient.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderFinalRecipientComponent {
	@Input() public form?: FormGroup;
}
