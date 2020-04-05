import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-einvoice-shipper",
	templateUrl: "./einvoice-shipper.component.html",
	styleUrls: ["./einvoice-shipper.component.scss", "../einvoice-section.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceShipperComponent {
	@Input() public form?: FormGroup;
	public showContent = true;
}
