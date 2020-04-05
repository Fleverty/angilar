import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-consignee-accept",
	styleUrls: ["./ewaybill-consignee-accept.component.scss"],
	templateUrl: "./ewaybill-consignee-accept.component.html"
})

export class EwaybillConsigneeAcceptComponent {
	@Input() public form?: FormGroup;
	@Input() public readonly showAdditionalFields = false;
	public showContent = true;
}
