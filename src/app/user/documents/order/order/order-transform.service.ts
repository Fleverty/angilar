import { Injectable } from "@angular/core";
import { OrderParams, OrderProductParams, OrderFormSettings, OrderResponseParams } from "@helper/abstraction/order";
import { OrderForm, OrderResponseForm } from "./order-form-builder.service";

type NullableOrPartial<T> = { [P in keyof T]?: T[P] | undefined | null };

@Injectable()
export class OrderTransformService {
	public tryToOrdersParams(form: OrderForm): Partial<OrderParams> {
		const dirtyParams: NullableOrPartial<OrderParams> = {};
		dirtyParams.draftType = form.draftType;
		dirtyParams.draftId = form.draftId;
		dirtyParams.id = +form.id;
		dirtyParams.contractNumber = form.common.contractNumber;
		dirtyParams.documentDate = form.common.orderDate;
		dirtyParams.deliveryDate = form.common.deliveryDate;
		dirtyParams.shipmentDate = form.common.shipmentDate;
		dirtyParams.currency = form.common.currency;
		dirtyParams.orderContactName = form.common.orderContactName;
		dirtyParams.orderContactEmail = form.common.orderContactEmail;
		dirtyParams.orderContactPhone = form.common.orderContactPhone;
		dirtyParams.buyerId = form.buyer.buyerId;
		dirtyParams.buyerName = form.buyer.buyerName;
		dirtyParams.buyerGln = form.buyer.buyerGln;
		dirtyParams.supplierName = form.supplier.supplierName;
		dirtyParams.supplierGln = form.supplier.supplierGln;
		dirtyParams.deliveryPointAddress = form.supplyPoint.deliveryPointAddress;
		dirtyParams.deliveryPointGln = form.supplyPoint.deliveryPointGln;
		dirtyParams.deliveryPointId = form.supplyPoint.deliveryPointId;
		dirtyParams.deliveryPointName = form.supplyPoint.deliveryPointName;
		dirtyParams.ultimateRecipientAddress = form.finalRecipient.ultimateRecipientAddress;
		dirtyParams.ultimateRecipientGln = form.finalRecipient.ultimateRecipientGln;
		dirtyParams.orderComment = form.comment.commentText;
		dirtyParams.documentNumber = form.common.senderOrderNumber;
		dirtyParams.dateCreate = form.common.orderDate;
		dirtyParams.documentNameCode = form.common.orderKindId;
		dirtyParams.msgDate = form.common.msgDate;
		dirtyParams.msgNumber = form.common.msgNumber;

		dirtyParams.orderDeliveryDate = form.common.responseDate;

		dirtyParams.totalQuantity = form.product.totalQuantity;
		dirtyParams.totalQuantityLu = form.product.totalQuantityLu;
		dirtyParams.totalAmountWithoutVat = form.product.totalAmountWithoutVat;
		dirtyParams.totalAmountVat = form.product.totalAmountVat;
		dirtyParams.totalAmountWithVat = form.product.totalAmountWithVat;
		dirtyParams.formSettings = {} as OrderFormSettings;
		dirtyParams.formSettings.autoSum = form.product.autoSum;
		dirtyParams.formSettings.items = [];
		form.product.products.forEach((p, index) => {
			if (dirtyParams.formSettings)
				dirtyParams.formSettings.items[index] = p.autoSum;
		});
		// dirtyParams.deliveryError = form.common.errorText;
		// dirtyParams.deliveryPointAddress = form.supplyPoint.address;
		// dirtyParams.deliveryPointGln = form.supplyPoint.gln;
		// dirtyParams.deliveryStatus = form.common.deleveryStatusId ? +form.common.deleveryStatusId : undefined;
		dirtyParams.msgOrdersItems = form.product.products.map(p => ({
			action: p.action,
			position: p.position,
			codeByBuyer: p.codeByBuyer,
			codeBySupplier: p.codeBySupplier,
			fullName: p.fullName,
			uom: {
				id: p.uom && p.uom.id,
				name: p.uom && p.uom.name,
				alpha3: p.uom && p.uom.alpha3
			},
			quantityOrdered: p.quantityOrdered,
			priceNet: p.priceNet,
			vatRate: p.vatRate,
			quantityInPack: p.quantityInPack,
			quantityOrderedLu: p.quantityOrderedLu,
			type: p.type,
			amountWithoutVat: p.amountWithoutVat,
			amountVat: p.amountVat,
			amountWithVat: p.amountWithVat,
			gtin: p.gtin
		}) as OrderProductParams); // fix it when api become stable

		return this.normilize(dirtyParams);
	}

	public tryToOrdrspParams(form: OrderResponseForm): Partial<OrderResponseParams> {
		const dirtyParams: NullableOrPartial<OrderResponseParams> = {};
		dirtyParams.ordrspDeliveryDate = form.responseDate;

		dirtyParams.totalQuantity = form.product.totalQuantity;
		dirtyParams.totalQuantityLu = form.product.totalQuantityLu;
		dirtyParams.totalAmountWithoutVat = form.product.totalAmountWithoutVat;
		dirtyParams.totalAmountVat = form.product.totalAmountVat;
		dirtyParams.totalAmountWithVat = form.product.totalAmountWithVat;
		dirtyParams.autoSum = form.product.autoSum;
		dirtyParams.formSettings = {} as OrderFormSettings;
		dirtyParams.formSettings.autoSum = form.product.autoSum;
		dirtyParams.formSettings.items = [];
		form.product.products.forEach((p, index) => {
			if (dirtyParams.formSettings)
				dirtyParams.formSettings.items[index] = p.autoSum;
		});

		dirtyParams.ordrspComment = form.orderComment;

		dirtyParams.msgOrdrspItems = form.product.products.map(p => ({
			action: p.action,
			position: p.position,
			codeByBuyer: p.codeByBuyer,
			codeBySupplier: p.codeBySupplier,
			fullName: p.fullName,
			uom: {
				id: p.uom && p.uom.id,
				name: p.uom && p.uom.name,
				alpha3: p.uom && p.uom.alpha3
			},
			quantityOrdered: p.quantityOrdered,
			quantityAccepted: p.quantityAccepted,
			priceNet: p.priceNet,
			vatRate: p.vatRate,
			quantityInPack: p.quantityInPack,
			quantityOrderedLu: p.quantityOrderedLu,
			type: p.type,
			amountWithoutVat: p.amountWithoutVat,
			amountVat: p.amountVat,
			amountWithVat: p.amountWithVat,
			autoSum: p.autoSum,
			gtin: p.gtin
		}) as OrderProductParams); // fix it when api become stable
		return this.normilize(dirtyParams);
	}

	public normilize(dirtyParams: NullableOrPartial<OrderParams>): Partial<OrderParams> {
		for (const key in dirtyParams) {
			const value = dirtyParams[key as keyof OrderParams];
			if (value === null && value === undefined)
				delete dirtyParams[key as keyof OrderParams];
		}

		return {
			...dirtyParams as Partial<OrderParams>
		}; // todo full new intstance by json
	}
}
