import { Injectable } from "@angular/core";
import { EwaybillForm, EwaybillProductForm } from "./ewaybill/ewaybill-form";
import { EwaybillDocument } from "./ewaybill";
import { DraftType } from "@helper/abstraction/draft";
import { EwaybillProduct, ProductDocumentInformation } from "@helper/abstraction/ewaybill";
import { ExtraFieldForm } from "./ewaybill-extra-information/ewaybill-extra-information.component";

type ExtraFieldFormKey = keyof ExtraFieldForm;
type ProductDocumentInformationKey = keyof ProductDocumentInformation;

@Injectable()
export class EwaybillTransformService {
	public toEwaybillDocument(value: EwaybillForm, draftType: DraftType): EwaybillDocument {
		return this.normalizeEwaybill(new EwaybillDocument(
			value,
			value.products.products.map(p => this.toEwaybillProduct(p)),
			value.products.totalSums,
			value.products.totalSums.isAutoSum,
			draftType
		));
	}

	public toEwaybillProduct(formValue: EwaybillProductForm): EwaybillProduct {
		return this.normalizeProduct(formValue);
	}

	public normalizeExtraFieldList(form: EwaybillProductForm): void {
		form.msgEwaybillExtraFieldList.forEach((extraField, index) => {
			if (Object.keys(extraField).every(key => extraField[key as ExtraFieldFormKey] === null || extraField[key as ExtraFieldFormKey] === "")) {
				form.msgEwaybillExtraFieldList.splice(index, 1);
				this.normalizeExtraFieldList(form);
			}
		});
	}

	public normalizeItemCertList(form: EwaybillProductForm): void {
		form.msgEwaybillItemCertList.forEach((cert, index) => {
			if (Object.keys(cert).every(key => cert[key as ProductDocumentInformationKey] === null || cert[key as ProductDocumentInformationKey] === "" || cert[key as ProductDocumentInformationKey] === undefined)) {
				form.msgEwaybillItemCertList.splice(index, 1);
				this.normalizeItemCertList(form);
			}
		});
	}

	private normalizeProduct(form: EwaybillProductForm): EwaybillProductForm {
		// const isAllExtraNull = form.msgEwaybillExtraFieldList.every(extraField =>
		// 	Object.keys(extraField).every(key => extraField[key as ExtraFieldFormKey] === null)
		// );

		// const isAllCertNull = form.msgEwaybillItemCertList.every(cert =>
		// 	Object.keys(cert).every(key => cert[key as ProductDocumentInformationKey] === null)
		// );
		// if (isAllExtraNull)
		// 	form.msgEwaybillExtraFieldList = [];
		// if (isAllCertNull)
		// 	form.msgEwaybillItemCertList = [];

		for (const key in form) {
			if (form[key as keyof EwaybillProductForm] === "") {
				(form[key as keyof EwaybillProductForm] as any) = null;
			}
		}

		this.normalizeExtraFieldList(form);
		this.normalizeItemCertList(form);

		return form;
	}

	private normalizeEwaybill(ewaybill: EwaybillDocument): EwaybillDocument {
		const qt = ewaybill.quantityTrip;
		if (qt === "" || qt === undefined || qt === null)
			delete ewaybill.quantityTrip;

		return ewaybill;
	}
}
