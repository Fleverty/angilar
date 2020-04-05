import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-view-products-list",
	templateUrl: "./einvoicepmt-view-products-list.component.html",
	styleUrls: ["./einvoicepmt-view-products-list.component.scss"]
})
export class EinvoicepmtViewProductsListComponent {
	@Input() public document?: EinvoicepmtDto;

	public getFormatedExtraFieldsList(extraFields: ExtraField[]): string {
		return extraFields.filter((e: any) => Object.keys(e).every((key: string) => e[key])).map((e: ExtraField) => `${e.fieldName || ""}: ${e.fieldValue || ""}`).join("; ");
	}

	public isAllIsNotNull(array: any[]): boolean {
		return !array.every(element => Object.keys(element).every(key => !element[key]));
	}
}
