import { Component, Input } from "@angular/core";
import { Einvoice } from "@helper/abstraction/einvoice";

@Component({
	selector: "app-shared-einvoice-signature",
	templateUrl: "./shared-einvoice-signature.component.html",
	styleUrls: ["../einvoice-signature.component.scss"]
})
export class SharedEinvoiceSignatureComponent {
	@Input() public readonly draft?: Einvoice;
}
