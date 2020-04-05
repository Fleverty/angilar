import { Component, Input } from "@angular/core";
import { Ewaybill } from "@helper/abstraction/ewaybill";

@Component({
	selector: "app-ewaybill-cancel-signature",
	templateUrl: "./ewaybill-cancel-signature.component.html",
	styleUrls: ["../ewaybill-signature.component.scss"]
})
export class EwaybillCancelSignatureComponent {
	@Input() public readonly draft?: Ewaybill;
}
