import { EwaybillProduct, Ewaybill } from "@helper/abstraction/ewaybill";
import { EwaybillAttachedDocumentsForm } from "./ewaybill-attached-documents/ewaybill-attached-documents.component";
import { ExtraFieldForm } from "./ewaybill-extra-information/ewaybill-extra-information.component";
import { Currency } from "@helper/abstraction/currency";
import { Big } from "big.js";
import { DraftType } from "@helper/abstraction/draft";
import { EwaybillForm, TotalSumsForm as ITotalSums, TotalSumsForm } from "./ewaybill/ewaybill-form";

export class EwaybillDocument implements Ewaybill {
	public documentNumber?: string;
	//Подпись 
	public certificate?: string;
	public certificateUserName?: string;
	public signatureDate?: Date;
	public signatureTime?: string;

	// Общая информация
	public id?: number;
	public testIndicator: boolean; // Тестовая
	public processingStatus?: string; // Статус
	public deliveryNoteNumber: string; // Серия // Номер
	public deliveryNoteDate?: Date; // Дата создания(дата)
	public ordersNumber?: string; // Номер заказа
	public contractNumber?: string; // Основание отпуска номер
	public contractDate?: Date; // Основание отпуска дата
	public contractName?: string; // Основание отпуска наименование
	public currency?: Currency; // Валюта

	// Грузоотправитель
	public shipperGln?: string; // Грузоотправитель GLN
	public shipperId?: number; // Грузоотправитель ID
	public shipperName?: string; // Грузоотправитель наименование
	public shipperAddress?: string; // Грузоотправитель адрес
	public shipperUnp?: string; // Грузоотправитель УНП
	public shipperProviderId?: string;

	// Грузополучатель 
	public receiverGln?: string; // Грузополучатель GLN
	public receiverId?: number; // Грузополучатель ID
	public receiverName?: string; // Грузополучатель наименование
	public receiverAddress?: string; // Грузополучатель адрес
	public receiverUnp?: string; // Грузополучатель УНП
	public receiverProviderId?: string;

	// Заказчик
	public freightPayerGln?: string; // Заказчик GLN
	public freightPayerId?: number; // Заказчик ID
	public freightPayerName?: string; // Заказчик наименование
	public freightPayerUnp?: string; // Заказчик адрес
	public freightPayerAddress?: string; // Грузополучатель адрес

	// Место погрузки
	public shipFrom: {
		id?: number;
		gln?: string;
		address?: string;
		contact?: string;
	}; // Место погрузки gln
	// Место разгрузки
	public shipTo: {
		id?: number;
		gln?: string;
		address?: string;
	};
	// public shipToGln?: string; // Место разгрузки gln	
	// public shipToId?: number; // Место разгрузки id
	// public shipToAddress?: string; // Место разгрузки адрес

	// Транспортные реквизиты
	public transportNumber?: string; // Марка и номер авто
	public trailerNumber?: string; // Марка и номер прицепа
	public waybillNumber?: string; // К путевому листу №
	public transportOwnerName?: string; // Владелец транспорта
	public transportContact?: string; // ФИО водителя
	public quantityTrip?: string; // кол-во заездов (maybe number?)

	// Реквизиты ответственных лиц
	public shipperContact?: string; // Отпуск разрешил
	public shipFromContact?: string; // Сдал грузоотправитель
	public shipperSealNumber?: string; // № пломбы
	public deliveryContact?: string; // Товар к перевозке принял
	public proxyDate?: Date; // По доверенности(дата)
	public proxyNumber?: string; // По доверенности(номер)
	public partyIssuingProxyName?: string; // Название организации, выдавшей доверенность
	public baseShippingDocumentName?: string; // Основание доставки(наименование) only for TN
	public baseShippingDocumentNumber?: string; // Основание доставки(номер) only for TN
	public baseShippingDocumentDate?: Date; // Основание доставки(дата) only for TN

	// С товаром переданы документы
	public msgEwaybillDocList?: EwaybillAttachedDocumentsForm[];

	// Дополнительные поля
	public msgEwaybillExtraFieldList?: ExtraFieldForm[];

	public msgEwaybillProductList: EwaybillProduct[];

	// public totalSums: TotalSums;
	public totalAmountExcise: string;
	public totalAmountVat: string;
	public totalAmountWithVat: string;
	public totalAmountWithoutVat: string;
	public totalGrossWeight: string;
	public totalLine: number;
	public totalQuantity: string;
	public totalQuantityLu: string;

	public functionCode = "9";

	public msgReceiverGln?: string;
	public msgReceiverId?: number;
	public msgSenderGln?: string;
	public msgSenderId?: number;
	public deliveryNoteType = "700";
	public msgType: DraftType = "BLRWBL";
	public autoSum: boolean;
	public formSettings?: {
		isPublicGlnAtShipTo: boolean;
		isPublicGlnAtShipFrom: boolean;
		isAutoSum: boolean;
		productsPositionWithAutoSum: number[];
	};

	constructor(formValue: EwaybillForm, products: EwaybillProduct[], totalSums: TotalSumsForm, isAutoSum: boolean, draftType: DraftType) {
		this.id = formValue.id ? +formValue.id : undefined;
		this.testIndicator = formValue.testIndicator || false;
		this.processingStatus = "0";
		this.documentNumber = formValue.common && formValue.common.number ? formValue.common.number : undefined;
		this.deliveryNoteNumber = `${formValue.common && formValue.common.seria01}-${formValue.common && formValue.common.seria02}`;
		this.deliveryNoteDate = formValue.common && formValue.common.deliveryNoteDate;
		this.ordersNumber = formValue.common && formValue.common.ordersNumber;
		this.contractNumber = formValue.common && formValue.common.contractNumber;
		this.contractDate = formValue.common && formValue.common.contractDate;
		this.contractName = formValue.common && formValue.common.contractName;
		this.currency = formValue.common && formValue.common.currency;

		this.shipperGln = formValue.shipper && formValue.shipper.gln;
		this.shipperId = formValue.shipper && formValue.shipper.dictionary.id;
		this.msgSenderGln = formValue.shipper && formValue.shipper.gln;
		this.msgSenderId = formValue.shipper && formValue.shipper.dictionary.id;
		this.shipperName = formValue.shipper && formValue.shipper.dictionary.name;
		this.shipperAddress = formValue.shipper && formValue.shipper.dictionary.addressFull;
		this.shipperUnp = formValue.shipper && formValue.shipper.unp;
		// this.shipperProviderId = formValue.common && formValue.common.seria01;

		this.receiverGln = formValue.сonsignee && formValue.сonsignee.gln;
		this.receiverId = formValue.сonsignee && formValue.сonsignee.id;
		this.msgReceiverGln = formValue.сonsignee && formValue.сonsignee.gln;
		this.msgReceiverId = formValue.сonsignee && formValue.сonsignee.id;
		this.receiverName = formValue.сonsignee && formValue.сonsignee.name;
		this.receiverAddress = formValue.сonsignee && formValue.сonsignee.address;
		this.receiverUnp = formValue.сonsignee && formValue.сonsignee.unp;

		this.freightPayerGln = formValue.customer && formValue.customer.gln;
		this.freightPayerId = formValue.customer && formValue.customer.id;
		this.freightPayerName = formValue.customer && formValue.customer.name;
		this.freightPayerUnp = formValue.customer && formValue.customer.unp;
		this.freightPayerAddress = formValue.customer && formValue.customer.address;

		const loading = formValue.places && formValue.places.loading;

		this.shipFrom = loading ? {
			address: loading.address,
			gln: loading.gln,
			id: loading.loadingPoint && loading.loadingPoint.id || loading.publicGln && loading.publicGln.id,
			contact: formValue.details && formValue.details.shipFromContact
		} : {};

		const unloading = formValue.places && formValue.places.unloading;
		this.shipTo = unloading ? {
			address: unloading.address,
			gln: unloading.gln,
			id: unloading.unloadingPoint && unloading.unloadingPoint.id || unloading.publicGln && unloading.publicGln.id
		} : {};

		this.transportNumber = formValue.details && formValue.details.transportNumber;
		this.trailerNumber = formValue.details && formValue.details.trailerNumber;
		this.waybillNumber = formValue.details && formValue.details.waybillNumber;
		this.transportOwnerName = formValue.details && formValue.details.transportOwnerName;
		this.transportContact = formValue.details && formValue.details.transportContact;
		this.quantityTrip = formValue.details && formValue.details.quantityTrip;

		this.shipperContact = formValue.details && formValue.details.shipperContact;
		// this.shipFromContact = formValue.details && formValue.details.shipFromContact;
		this.shipperSealNumber = formValue.details && formValue.details.shipperSealNumber;
		this.deliveryContact = formValue.details && formValue.details.deliveryContact;
		this.proxyDate = formValue.details && formValue.details.proxyDate;
		this.proxyNumber = formValue.details && formValue.details.proxyNumber;
		this.partyIssuingProxyName = formValue.details && formValue.details.partyIssuingProxyName;

		this.baseShippingDocumentName = formValue.details && formValue.details.baseShippingDocumentName;
		this.baseShippingDocumentNumber = formValue.details && formValue.details.baseShippingDocumentNumber;
		this.baseShippingDocumentDate = formValue.details && formValue.details.baseShippingDocumentDate;

		this.msgEwaybillDocList = formValue.attached && formValue.attached.documents || [];

		this.msgEwaybillExtraFieldList = formValue.extras && formValue.extras.documents || [];

		this.msgEwaybillProductList = products.splice(0);

		this.functionCode = "9";
		this.deliveryNoteType = "700";
		this.msgType = draftType;

		this.totalAmountExcise = totalSums.amountExcise || "0";
		this.totalAmountVat = totalSums.amountVat || "0";
		this.totalAmountWithVat = totalSums.amountWithVat || "0";
		this.totalAmountWithoutVat = totalSums.amountWithoutVat || "0";
		this.totalGrossWeight = totalSums.grossWeight || "0";
		this.totalLine = this.msgEwaybillProductList.length;
		this.totalQuantity = totalSums.quantityDespatch || "0";
		this.totalQuantityLu = totalSums.quantityDespatchLu || "0";

		this.autoSum = isAutoSum;
		this.formSettings = {
			isAutoSum,
			isPublicGlnAtShipFrom: loading.isPublicGln,
			isPublicGlnAtShipTo: unloading.isPublicGln,
			productsPositionWithAutoSum: formValue.products.products.filter(e => e.autoSum).map((e, i) => i)
		};
	}
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type TotalSumsKeys = keyof Omit<ITotalSums, "isAutoSum">;

export class TotalSums implements ITotalSums {
	public quantityDespatch: string;
	public priceNet: string;
	public amountVat: string;
	public amountExcise: string;
	public vatRate: string;
	public amountWithVat: string;
	public amountWithoutVat: string;
	public quantityDespatchLu: string;
	public grossWeight: string;
	public isAutoSum: boolean;

	constructor(initValue?: Partial<ITotalSums>) {
		this.quantityDespatch = initValue && initValue.quantityDespatch || "0";
		this.priceNet = initValue && initValue.priceNet || "0";
		this.amountVat = initValue && initValue.amountVat || "0";
		this.amountExcise = initValue && initValue.amountExcise || "0";
		this.vatRate = initValue && initValue.vatRate || "0";
		this.amountWithVat = initValue && initValue.amountWithVat || "0";
		this.amountWithoutVat = initValue && initValue.amountWithoutVat || "0";
		this.quantityDespatchLu = initValue && initValue.quantityDespatchLu || "0";
		this.grossWeight = initValue && initValue.grossWeight || "0";
		this.isAutoSum = initValue && initValue.isAutoSum || true;
	}

	public calculate(products: EwaybillProduct[]): TotalSums {
		const newSums = new TotalSums();
		Object.keys(newSums).forEach((key: string) => {
			if (key !== "isAutoSum")
				newSums[key as TotalSumsKeys] = products.reduce((acc, curr) => (new Big(acc)).plus(new Big(curr[key as TotalSumsKeys] || 0)), new Big(0)).round(2).toString();
		});
		return newSums;
	}
}
