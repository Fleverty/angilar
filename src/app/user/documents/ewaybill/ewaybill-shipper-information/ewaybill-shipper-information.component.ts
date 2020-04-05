import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-ewaybill-shipper-information",
	templateUrl: "./ewaybill-shipper-information.component.html",
	styleUrls: ["./ewaybill-shipper-information.component.scss", "../ewaybill-default-component.scss"]
})
export class EwaybillShipperInformationComponent {
	public showContent = true;
	@Input() public form?: FormGroup;
}
