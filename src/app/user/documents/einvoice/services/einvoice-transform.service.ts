import { Injectable } from "@angular/core";
import { EinvoiceForm, EinvoiceProductForm } from "../einvoice-form";
import { EinvoiceDocument } from "../einvoice";
import { DraftType } from "@helper/abstraction/draft";
import { EinvoiceProduct, EinvoiceParams } from "@helper/abstraction/einvoice";

@Injectable()
export class EinvoiceTransformService {
	public toEinvoiceDocument(value: EinvoiceForm, draftType: DraftType): EinvoiceDocument {
		return new EinvoiceDocument(
			value,
			value.products.products.map(p => this.toEinvoiceProduct(p)),
			value.products.totalSums,
			value.products.totalSums.isAutoSum,
			draftType
		);
	}

	public toEinvoiceProduct(formValue: EinvoiceProductForm): EinvoiceProduct {
		return formValue as any;
	}

	public toEinvoiceParams(formValue: EinvoiceForm): Partial<EinvoiceParams> {
		return {
			id: formValue.id,
			invoiceNumber: `${formValue.common && formValue.common.seria01}-${formValue.common && formValue.common.seria02}`,
			invoiceDate: formValue.common.invoiceDate,
			purport: formValue.common.purport,
			paymentBeginDate: formValue.common.paymentBeginDate,
			paymentEndDate: formValue.common.paymentEndDate,
			supplierData: formValue.supplierData,
			testIndicator: formValue.common.testIndicator,
			contractDate: formValue.common.contractDate,
			contractNumber: formValue.common.contractNumber,
			documentNumber: formValue.common.number,
			currency: formValue.common.currency,
			documentDate: new Date(),
			orderNumber: formValue.common.ordersNumber,
			processingStatus: formValue.common.processingStatus ? +formValue.common.processingStatus : undefined,
			supplier: {
				id: formValue.supplier.supplierId,
				gln: formValue.supplier.supplierGln,
				name: formValue.supplier.supplierName,
				address: formValue.supplier.supplierAddress,
				unp: formValue.supplier.supplierUnp,
				accountNumber: formValue.supplier.supplierAccountNumber,
				bankName: formValue.supplier.supplierBankName,
				bankAddress: formValue.supplier.supplierBankAddress,
				bankCode: formValue.supplier.supplierBankCode,
			},
			buyer: {
				id: formValue.buyer.buyerId,
				gln: formValue.buyer.buyerGln,
				name: formValue.buyer.buyerName ? formValue.buyer.buyerName.name : undefined,
				address: formValue.buyer.buyerAddress,
				unp: formValue.buyer.buyerUnp,
				accountNumber: formValue.buyer.buyerAccountNumber,
				bankName: formValue.buyer.buyerBankName,
				bankAddress: formValue.buyer.buyerBankAddress,
				bankCode: formValue.buyer.buyerBankCode,
			},
			// shipper: {
			// 	id: formValue.shipper.id,
			// 	gln: formValue.shipper.gln,
			// 	name: formValue.shipper.name,
			// 	address: formValue.shipper.address,
			// 	unp: formValue.shipper.unp,
			// },
			// receiver: {
			// 	id: formValue.consignee.id,
			// 	gln: formValue.consignee.gln,
			// 	name: formValue.consignee.name,
			// 	address: formValue.consignee.address,
			// 	unp: formValue.consignee.unp,
			// },
			// shipFrom: formValue.places.loading.loadingPoint ? {
			// 	id: formValue.places.loading.loadingPoint.id,
			// 	gln: formValue.places.loading.gln,
			// 	address: formValue.places.loading.address,
			// 	name: undefined,
			// 	contact: undefined
			// } : undefined,
			// shipTo: formValue.places.unloading.unloadingPoint ? {
			// 	id: formValue.places.unloading.unloadingPoint.id,
			// 	gln: formValue.places.unloading.gln,
			// 	address: formValue.places.unloading.address,
			// 	name: undefined,
			// 	contact: undefined
			// } : undefined,
			extraFieldList: formValue.extras.documents,
			einvoiceItemList: formValue.products.products,
			totalAmountWithoutVat: +formValue.products.totalSums.amountWithoutVat,
			totalAmountWithVat: +formValue.products.totalSums.amountWithVat,
			totalAmountVat: +formValue.products.totalSums.amountVat,
			totalAmountExcise: +formValue.products.totalSums.amountExcise,
			totalLine: formValue.products.products.length,
			totalQuantity: +formValue.products.totalSums.quantity
		};
	}
}
