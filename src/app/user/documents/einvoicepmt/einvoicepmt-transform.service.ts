import { Injectable } from "@angular/core";
import {
	EinvoicepmtDto,
	EinvoicepmtFormValue,
	EinvoicepmtProductDto
} from "@helper/abstraction/einvoicepmt";

type NullableOrPartial<T> = { [P in keyof T]?: T[P] | undefined | null };

@Injectable()
export class EinvoicepmtTransformService {
	public toEinvoicepmtDto(form: EinvoicepmtFormValue): Partial<EinvoicepmtDto> {
		const dirtyParams: NullableOrPartial<EinvoicepmtDto> = {};
		const c = form.common;
		const s = form.supplier;
		const b = form.buyer;
		const sh = form.shipper;
		const r = form.receiver;
		// dirtyParams.processingStatus = form.common.processingStatus.toString();
		dirtyParams.id = form.id;
		dirtyParams.supplierData = {
			dateCreate: c.dateCreate
		};
		dirtyParams.invoicepmtNumber = [c.invoicepmtNumber1, c.invoicepmtNumber2, c.invoicepmtNumber3].filter(e => !!e).join("-");
		dirtyParams.invoicepmtDate = c.invoicepmtDate;
		dirtyParams.documentNumber = c.contractNumber;
		dirtyParams.documentDate = c.contractDate;
		dirtyParams.contractNumber = c.contractNumber;
		dirtyParams.contractDate = c.contractDate;
		dirtyParams.currency = c.currency;
		dirtyParams.paymentTerm = c.paymentTerm;
		dirtyParams.buyingFor = c.purchaseTarget;
		dirtyParams.deliveryTerm = c.deliveryTerms;
		dirtyParams.expireDate = c.expireDate;
		dirtyParams.deliveryTime = c.deliveryTime;
		dirtyParams.testIndicator = c.testIndicator;
		dirtyParams.supplier = {
			name: s.supplierName,
			address: s.supplierAddress,
			gln: s.supplierGln,
			unp: s.supplierUnp,
			okpo: s.supplierOkpo,
			accountNumber: s.supplierAccountNumber,
			bankName: s.supplierBankName,
			bankCode: s.supplierBankCode,
			bankAddress: s.supplierBankAddress
		};
		dirtyParams.buyer = {
			name: b.buyerName,
			address: b.buyerAddress,
			gln: b.buyerGln,
			unp: b.buyerUnp,
			okpo: b.buyerOkpo,
			accountNumber: b.buyerAccountNumber,
			bankName: b.buyerBankName,
			bankCode: b.buyerBankCode,
			bankAddress: b.buyerBankAddress
		};
		dirtyParams.shipper = this.normalize({
			name: sh.shipperName,
			address: sh.shipperAddress,
			gln: sh.shipperGln,
			unp: sh.shipperUnp
		});
		dirtyParams.dateCreate = c.dateCreate;
		dirtyParams.receiver = this.normalize({
			name: r.receiverName,
			address: r.receiverAddress,
			gln: r.receiverGln,
			unp: r.receiverUnp
		});
		dirtyParams.extraFieldList = form.additionalFields.fields.filter((e: any) => !Object.keys(e).every((key: string) => e[key] === null)).map(e => this.normalize(e));
		dirtyParams.totalLine = form.products.products && form.products.products.length;
		dirtyParams.formSettings = {
			isAutoSum: form.products.totalSums.isAutoSum,
			productsPositionWithAutoSum: form.products.products.filter(e => e.autoSum).map((e, i) => i),
			additionalFieldsDictionary: form.additionalFields.fields.map(e => e.dictionary && e.dictionary.fieldName)
		};
		dirtyParams.msgEincoicepmtProductList = form.products.products.map(p => ({
			position: p.position,
			gtin: p.gtin || null,
			fullName: p.fullName,
			uom: p.uom,
			quantityDespatch: p.quantityDespatch,
			codeByBuyer: p.codeByBuyer,
			codeBySupplier: p.codeBySupplier,
			addInfo: p.addInfo,
			priceNet: p.priceNet,
			vatRate: p.vatRate,
			amountVat: p.amountVat,
			amountWithoutVat: p.amountWithoutVat,
			amountWithVat: p.amountWithVat,
			msgEinvoicepmtExtraFieldList: p.msgEinvoicepmtExtraFieldList.filter((e: any) => !Object.keys(e).every((key: string) => e[key] === null)).map(e => this.normalize(e))
		} as EinvoicepmtProductDto));
		dirtyParams.totalAmountVat = form.products.totalSums.amountVat;
		dirtyParams.totalAmountWithoutVat = form.products.totalSums.amountWithoutVat;
		dirtyParams.totalAmountWithVat = form.products.totalSums.amountWithVat;
		dirtyParams.totalQuantity = form.products.totalSums.quantity;
		return this.normalize(dirtyParams);
	}

	public normalize<T>(dirtyParams: NullableOrPartial<T>): Partial<T> {
		for (const key in dirtyParams) {
			const value = dirtyParams[key as keyof T];
			if (value === null || value === undefined || (value instanceof Object && !(value instanceof Date) && Object.keys(value).length === 0))
				delete dirtyParams[key as keyof T];
		}

		return {
			...dirtyParams as Partial<T>
		};
	}
}
