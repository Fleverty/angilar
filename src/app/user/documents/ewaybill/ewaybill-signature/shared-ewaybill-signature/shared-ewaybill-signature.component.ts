import { Component, Input } from "@angular/core";
import { Ewaybill } from "@helper/abstraction/ewaybill";

@Component({
	selector: "app-shared-ewaybill-signature",
	templateUrl: "./shared-ewaybill-signature.component.html",
	styleUrls: ["../ewaybill-signature.component.scss"]
})
export class SharedEwaybillSignatureComponent {
	@Input() public readonly draft?: Ewaybill;
}
