import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { OrderStatusService } from "@app/user/documents/order/order-status.service";
import { OrderResponseParams } from "@helper/abstraction/order";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-order-response-draft-main",
	templateUrl: "./order-response-draft-main.component.html",
	styleUrls: ["./order-response-draft-main.component.scss"]
})
export class OrderResponseDraftMainComponent {
	@Input() public form?: FormGroup;
	@Input() public document?: OrderResponseParams;

	constructor(public readonly orderStatusService: OrderStatusService) { }
}
