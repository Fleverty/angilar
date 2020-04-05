import { Component, ChangeDetectionStrategy, Input, Inject, LOCALE_ID } from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";
import { Ewaybill, ProductDocumentInformation } from "@helper/abstraction/ewaybill";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { DatePipe } from "@angular/common";
import { TranslationService } from "@core/translation.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-view-products",
	styleUrls: ["./ewaybill-view-products.component.scss"],
	templateUrl: "./ewaybill-view-products.component.html"
})

export class EwaybillViewProductsComponent {
	@Input() public draft?: Ewaybill;
	@Input() public messageType?: DraftType;

	constructor(
		private readonly translationService: TranslationService,
		@Inject(LOCALE_ID) public locale: string
	) { }

	public getFormatedExtraFieldsList(extraFields: ExtraField[]): string {
		return extraFields.map((e: ExtraField) => `${e.fieldName}: ${e.fieldValue}`).join("; ");
	}

	public getFormatedCertsList(certList: ProductDocumentInformation[]): string {
		const datePipe = new DatePipe(this.locale);
		return certList.map((c: ProductDocumentInformation) => {
			const arr = [c.certType && c.certType.nameShort, c.certNumber];
			if (c.dateFrom) arr.push(`${this.translationService.getTranslation("from")} ${datePipe.transform(c.dateFrom, "dd.MM.yyy")}`);
			if (c.dateTo) arr.push(`${this.translationService.getTranslation("to")} ${datePipe.transform(c.dateTo, "dd.MM.yyy")}`);
			if (c.certPartyIssuingName) arr.push(`${this.translationService.getTranslation("issued")} ${c.certPartyIssuingName}`);
			return arr.join(" ");
		}).join("; ");
	}

	public isAllIsNotNull(array: any[]): boolean {
		return !array.every(element => Object.keys(element).every(key => !element[key]));
	}
}
