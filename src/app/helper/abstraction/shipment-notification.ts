import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";

export type ProductTypes = "CU" | "RC";

export interface ShipmentNotificationProduct {
	position: number; // Позиция товара в списке
	gtin: number;  // GTIN
	codeByBuyer: string;  	// Номер товара, приcвоеный покупателем
	codeBySupplier: string;	// Номер товара, приcвоеный продавцом
	fullName: string;	// Наименование товара
	uom: UnitOfMeasure;	// Единица измерения
	quantityOrdered: number; // Заказанное количество
	quantityDespatch: number; // Отгруженное количество
	quantityOrderedLu: number; // Количество грузовых мест
	quantityDespatchLu: number; // Количество грузовых мест
	manufacturerName: string; // Наименование производителя
	countryOfOrigin: Country;	// Страна производства
	productionDate: Date; // Дата производства
	expireDate: Date;	// Срок реализации
	priceManufacturer: number;		// Цена изготовителя
	priceNet: number;	// Цена, Br
	vatRate: number;	// Ставка, НДС
	grossWeight: number;	// Масса груза, тонны
	type: string; // Тип товара
	batchNumber: string; // Номер партии
	customDeclarationNumber: number; // Номер таможенной декларации (ГТД)
	certificateNumber: number; // Сертификат (номер и дата)
	addInfo: string;	// Примечание
	amountWithoutVat: number; // Стоимость
	amountVat: number; // Сумма НДС
	amountWithVat: number; // Стоимость с НДС
	ultimateAmountWithoutVat: number; // Стоимость без НДС для конечного покупателя
	ultimateAmountVat: number; // Сумма НДС для конечного покупателя
	autoSum: boolean;

	/*	discountBulkRate: number;		// Оптовая скидка
		discountRate: number;	// Скидка, %
		amountExcise: number; // Сумма акциза
		quantityDespatchLu: number;	// Количество грузовых мест
		msgEwaybillItemCertList: ProductDocumentInformation[];		// Информация о документе
		msgEwaybillExtraFieldList: ProductTypeTransportation[];		// Дополнительные поля*/
}

export interface ShipmentNotificationFormValue {
	id: string;
	common: {
		documentNumber: number;
		documentDate: string;
		deliveryNoteNumber: string;
		deliveryNoteDate: string;
		ultimateDeliveryNoteNumber: string;
		orderNumber: string;
		orderDate: string;
		deliveryDate: string;
		contractNumber: string;
		contractDate: string;
	};
	buyer: {
		buyerId: number;
		buyerName: string;
		buyerGln: string;
		buyerUnp: string;
	};
	supplier: {
		supplierName: string;
		supplierGln: string;
		supplierUnp: string;
	};
	shipmentPlace: {
		shipFromPointId: number;
		shipFromPointAddress: string;
		shipFromPointGln: string;
		shipFromPointName: string;
	};
	deliveryPlace: {
		deliveryPointId: number;
		deliveryPointAddress: string;
		deliveryPointName: string;
		deliveryPointGln: string;
	};
	transportationCustomer: {
		freightPayerName: string;
		freightPayerGln: string;
		freightPayerUnp: string;
	};
	finalRecipient: {
		ultimateRecipientAddress: string;
		ultimateRecipientGln: string;
	};
	transportDetails: {
		transportNumber: string;
		trailerNumber: string;
		waybillNumber: string;
		transportOwnerName: string;
		transportContact: string;
		quantityTrip: number;
	};
	detailsResponsiblePersons: {
		shipperContact: string;
		shipFromContact: string;
		deliveryContact: string;
		proxy: Proxy;
	};
	products: {
		products: ShipmentNotificationProduct[];
		totalSums: TotalSums;
	};
}

export interface ShipmentNotificationDraft {
	autoSum?: boolean;
	buyerGln?: string;
	buyerId?: number;
	buyerName?: string;
	buyerUnp?: string;
	completeMsgProvider?: boolean;
	completeMsgReceiver?: boolean;
	completeMsgSender?: boolean;
	contractDate?: string;
	contractNumber?: string;
	dateCreate?: string;
	deliveryContact?: string;
	deliveryDate?: string;
	deliveryError?: string;
	deliveryNoteDate?: string;
	deliveryNoteNumber?: string;
	deliveryPointAddress?: string;
	deliveryPointGln?: string;
	deliveryPointId?: number;
	deliveryStatus?: number;
	documentDate?: string;
	documentNameCode?: string;
	documentNumber?: number;
	ewaybillId?: number;
	freightPayerGln?: string;
	freightPayerId?: number;
	freightPayerName?: string;
	freightPayerUnp?: string;
	functionCode?: string;
	id?: number;
	msgDate?: string;
	msgDesadvItems?: ShipmentNotificationProduct[];
	msgNumber?: string;
	msgReceiverGln?: string;
	msgReceiverId?: number;
	msgSenderGln?: string;
	msgSenderId?: number;
	msgVersion?: string;
	orderDate?: string;
	orderId?: 0;
	orderNumber?: string;
	partyIssuingProxyName?: string;
	processingStatus?: number;
	proxyDate?: Date;
	proxyNumber?: string;
	quantityTrip?: number;
	readMsgReceiver?: boolean;
	readMsgSender?: boolean;
	shipFromContact?: string;
	shipFromPointAddress?: string;
	shipFromPointGln?: string;
	shipFromPointId?: number;
	shipperContact?: string;
	supplierGln?: string;
	supplierId?: number;
	supplierName?: string;
	supplierUnp?: string;
	totalAmountVat?: string;
	totalAmountWithVat?: string;
	totalAmountWithoutVat?: string;
	totalGrossWeight?: string;
	totalLine?: number;
	totalPackage?: number;
	totalQuantity?: string;
	totalQuantityLu?: string;
	trailerNumber?: string;
	transportContact?: string;
	transportNumber?: string;
	transportOwnerName?: string;
	ultimateDeliveryNoteNumber?: string;
	ultimateRecipientAddress?: string;
	ultimateRecipientGln?: string;
	ultimateRecipientId?: number;
	userId?: number;
	waybillNumber?: string;
}

export interface TotalSums {
	quantityDespatch: string;
	quantityDespatchLu: string;
	amountWithoutVat: string;
	amountVat: string;
	amountWithVat: string;
	grossWeight: string;
	isAutoSum: boolean;
}

export interface Proxy {
	partyIssuingProxyName?: string;
	proxyDate?: Date;
	proxyNumber?: string;
}

export interface ShipmentNotification {
	autoSum?: boolean;
	buyerGln?: string;
	buyerId?: number;
	buyerName?: string;
	buyerUnp?: string;
	completeMsgProvider?: boolean;
	completeMsgReceiver?: boolean;
	completeMsgSender?: boolean;
	contractDate?: string;
	contractNumber?: string;
	dateCreate?: string;
	deliveryContact?: string;
	deliveryDate?: string;
	deliveryError?: string;
	deliveryNoteDate?: string;
	deliveryNoteNumber?: string;
	deliveryPointAddress?: string;
	deliveryPointName?: string;
	deliveryPointGln?: string;
	deliveryPointId?: number;
	deliveryStatus?: number;
	documentDate?: string;
	documentNameCode?: string;
	documentNumber?: number;
	ewaybillId?: number;
	freightPayerGln?: string;
	freightPayerId?: number;
	freightPayerName?: string;
	freightPayerUnp?: string;
	functionCode?: string;
	id?: string;
	msgDate?: string;
	msgDesadvItems?: ShipmentNotificationProduct[];
	msgNumber?: string;
	msgReceiverGln?: string;
	msgReceiverId?: number;
	msgSenderGln?: string;
	msgSenderId?: number;
	msgVersion?: string;
	orderDate?: string;
	orderId?: 0;
	orderNumber?: string;
	partyIssuingProxyName?: string;
	processingStatus?: number;
	proxyDate?: Date;
	proxyNumber?: string;
	quantityTrip?: number;
	readMsgReceiver?: boolean;
	readMsgSender?: boolean;
	shipFromContact?: string;
	shipFromPointName?: string;
	shipFromPointAddress?: string;
	shipFromPointGln?: string;
	shipFromPointId?: number;
	shipperContact?: string;
	supplierGln?: string;
	supplierId?: number;
	supplierName?: string;
	supplierUnp?: string;
	totalAmountVat?: string;
	totalAmountWithVat?: string;
	totalAmountWithoutVat?: string;
	totalGrossWeight?: string;
	totalLine?: number;
	totalPackage?: number;
	totalQuantity?: string;
	totalQuantityLu?: string;
	trailerNumber?: string;
	transportContact?: string;
	transportNumber?: string;
	transportOwnerName?: string;
	ultimateDeliveryNoteNumber?: string;
	ultimateRecipientAddress?: string;
	ultimateRecipientGln?: string;
	ultimateRecipientId?: number;
	userId?: number;
	waybillNumber?: string;
	isAutoSum?: boolean;
}
