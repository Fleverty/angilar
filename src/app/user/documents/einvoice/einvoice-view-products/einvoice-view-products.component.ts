import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { Einvoice } from "@helper/abstraction/einvoice";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-view-products",
	styleUrls: ["./einvoice-view-products.component.scss"],
	templateUrl: "./einvoice-view-products.component.html"
})

export class EinvoiceViewProductsComponent {
	@Input() public draft?: Einvoice;

	public getFormatedExtraFieldsList(extraFields: ExtraField[]): string {
		return extraFields.map((e: ExtraField) => `${e.fieldName}: ${e.fieldValue}`).join("; ");
	}

	public isAllIsNotNull(array: any[]): boolean {
		return !array.every(element => Object.keys(element).every(key => !element[key]));
	}
}
