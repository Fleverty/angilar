import { Component, Input } from "@angular/core";
import { EwaybillResponse } from "@helper/abstraction/ewaybill";

@Component({
	selector: "app-ewaybill-draft-signature",
	templateUrl: "./ewaybill-draft-signature.component.html",
	styleUrls: ["../ewaybill-signature.component.scss"]
})
export class EwaybillDraftSignatureComponent {
	@Input() public readonly draft?: EwaybillResponse;
}
