import { UnitOfMeasure } from "./unit-of-measures";
import { Country } from "./countries";

export type Einvoice = EinvoiceDto;
export type EinvoiceParams = EinvoiceDto;

// не трогать, это синхрнизирвано с беком!!!
export interface EinvoiceDto {
	id: number;
	cancelDocument: {
		id: number;
		signature: SignatureDto;
	};
	changeRequestList: any;
	signature: SignatureDto;
	confirmation: any;
	supplierSignature: SignatureDto;
	supplier2Signature: SignatureDto;
	buyerSignature: SignatureDto;
	buyer2Signature: SignatureDto;
	supplierData: EinvoiceDataDto;
	buyerData: EinvoiceDataDto;
	testIndicator: boolean;
	userId: number;
	documentNumber: string;
	documentDate: Date;
	functionCode: number;
	invoiceNumber: string;
	invoiceDate: Date;
	contractNumber: string;
	contractDate: Date;
	orderId: number;
	orderNumber: string;
	ewaybillId: number;
	deliveryNoteNumber: string;
	deliveryNoteDate: Date;
	rffInvoiceNumber: string;
	rffInvoiceDate: Date;
	supplier: SupplierDto;
	buyer: BuyerDto;
	shipper: ShipperDto;
	receiver: ReceiverDto;
	shipFrom: ShipFromDto;
	shipTo: ShipToDto;
	currency: any;
	totalAmountWithoutVat: number;
	totalAmountWithVat: number;
	totalAmountVat: number;
	totalAmountExcise: number;
	totalLine: number;
	totalQuantity: number;
	deliveryStatus: number;
	processingStatus: number;
	deliveryError: string;
	formSettings: FormSettings;
	additionalFields: string;
	readMsgReceiver: boolean;
	readMsgSender: boolean;
	completeMsgReceiver: boolean;
	completeMsgSender: boolean;
	completeMsgProvider: boolean;
	extraFieldList: ExtraFieldForm[];
	einvoiceItemList: EinvoiceProduct[];
	purport: string;
	paymentBeginDate: Date;
	paymentEndDate: Date;

	blrapnDesc?: string;
	dateCreate?: Date;
}

export interface EinvoiceDataDto {
	dateCreate: Date;
	msgSenderGln: string;
	msgSenderId: number;
	msgReceiverGln: string;
	msgReceiverId: number;
	msgNumber: string;
	msgType: string;
	msgDate: Date;
	msgVersion: string;
}

export interface ReceiverDto {
	id: number;
	gln: string;
	name: string;
	address: string;
	unp: string;
}

export interface ShipperDto {
	id: number;
	gln: string;
	name: string;
	address: string;
	unp: string;
}

export interface SupplierDto {
	id: number;
	gln: string;
	name: string;
	address: string;
	unp: string;
	accountNumber: string;
	bankName: string;
	bankAddress: string;
	bankCode: string;
}

export interface BuyerDto {
	id: number;
	gln: string;
	name?: string;
	address: string;
	unp: string;
	accountNumber: string;
	bankName: string;
	bankAddress: string;
	bankCode: string;
}

export interface ShipFromDto {
	id: number;
	gln: string;
	address: string;
	name?: string;
	contact?: string;
}

export interface ShipToDto {
	id: number;
	gln: string;
	address: string;
	name?: string;
	contact?: string;
}

export interface SignatureDto {
	certificate: string;
	certificateUserName: string;
	securityParty: string;
	signatureDate: Date;
	signatureTime: Date;
}

export interface FormSettings {
	isPublicGlnAtShipTo: boolean;
	isPublicGlnAtShipFrom: boolean;
	isAutoSum: boolean;
	productsPositionWithAutoSum: number[];
};

export interface EinvoiceProduct {
	position: number; // Позиция товара в списке
	gtin: number; // GTIN 
	codeByBuyer: string; // Номер товара, присвоенный покупателем
	codeBySupplier: string; // Номер товара, присвоенный продавцом
	fullName: string; // Наименование товара
	uom: UnitOfMeasure; // Единица измерения
	quantity: number; // Количество
	priceNet: number; // Цена, Br
	country: Country; // Страна производства
	vatRate: number; // Ставка, НДС
	amountExcise: number; //Сумма акциза
	addInfo: string; // Примечание
	einvoiceItemExtraFieldList: ExtraFieldForm[]; // Дополнительные поля
	amountVat: number; // Стоимость, Br
	amountWithVat: number; // Сумма НДС, Br
	amountWithoutVat: number; // Сумма с НДС, Br
}

export interface ProductDocumentInformation {
	name: string; // Название
	number: string; // Номер
	dateFrom: Date; // Дата с 
	dateTo: Date; // Дата до 
	issuedBy: string; // Кем выдан
}

export interface ExtraFieldForm {
	// dictionary: ExtraField;
	fieldName: string;
	fieldCode: string;
	fieldValue: string;
}
