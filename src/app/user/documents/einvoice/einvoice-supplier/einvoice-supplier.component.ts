import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-supplier",
	templateUrl: "./einvoice-supplier.component.html",
	styleUrls: ["./einvoice-supplier.component.scss", "../einvoice-section.scss"]
})
export class EinvoiceSupplierComponent {
	@Input() public form?: FormGroup;
	public showContent = true;
}
