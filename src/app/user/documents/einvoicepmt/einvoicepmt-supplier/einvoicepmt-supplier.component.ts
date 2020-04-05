import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-supplier",
	templateUrl: "./einvoicepmt-supplier.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-supplier.component.scss"]
})
export class EinvoicepmtSupplierComponent {
	@Input() public form?: FormGroup;
}
