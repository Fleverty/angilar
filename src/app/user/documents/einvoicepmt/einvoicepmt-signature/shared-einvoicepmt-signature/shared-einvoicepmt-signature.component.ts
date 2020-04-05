import { Component, Input } from "@angular/core";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";

@Component({
	selector: "app-shared-einvoicepmt-signature",
	templateUrl: "./shared-einvoicepmt-signature.component.html",
	styleUrls: ["../einvoicepmt-signature.component.scss"]
})
export class SharedEinvoicepmtSignatureComponent {
	@Input() public readonly document?: EinvoicepmtDto;
}
