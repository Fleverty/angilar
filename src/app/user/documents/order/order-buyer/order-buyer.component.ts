import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-order-buyer",
	templateUrl: "./order-buyer.component.html",
	styleUrls: ["../form.scss", "./order-buyer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBuyerComponent {
	@Input() public readonly form?: FormGroup;
}
