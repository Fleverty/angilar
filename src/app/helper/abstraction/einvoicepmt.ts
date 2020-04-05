import { Signature } from "@helper/abstraction/signature";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Partner } from "@helper/abstraction/partners";

export interface EinvoicepmtDto {
	id?: number;
	signature?: Signature;
	supplierSignature?: Signature;
	supplier2Signature?: Signature;
	confirmation?: any;
	supplierData?: EinvoicepmtSupplierDataDto;
	buyerData?: any;
	einvoicepmtOriginalId?: number;
	testIndicator?: boolean;
	userId?: number;
	documentNumber?: string;
	documentDate?: string;
	functionCode?: string;
	invoicepmtNumber?: string;
	invoicepmtNumber0?: string;
	invoicepmtNumber1?: string;
	invoicepmtDate?: string;
	dateCreate?: string;
	contractNumber?: string;
	contractDate?: string;
	expireDate?: string;
	paymentTerm?: string;
	buyingFor?: string;
	deliveryTerm?: string;
	deliveryTime?: string;
	supplier?: EinvoicepmtSupplierDto;
	buyer?: EinvoicepmtBuyerDto;
	shipper?: EinvoicepmtShipperDto;
	receiver?: EinvoicepmtReceiverDto;
	currency?: any;
	totalAmountWithoutVat?: string;
	totalAmountWithVat?: string;
	totalAmountVat?: string;
	totalLine?: number;
	totalQuantity?: string;
	deliveryStatus?: number;
	processingStatus?: string;
	deliveryError?: string;
	formSettings?: {
		productsPositionWithAutoSum: number[];
		isAutoSum: boolean;
		additionalFieldsDictionary: (string | undefined)[];
	};
	responseDocument?: {
		signature?: Signature;
	};
	extraFieldList?: ExtraFieldForm[];
	msgEincoicepmtProductList?: EinvoicepmtProductDto[];
}

interface EinvoicepmtSupplierDataDto {
	dateCreate?: string;
	msgSenderGln?: string;
	msgSenderId?: number;
	msgReceiverGln?: string;
	msgReceiverId?: number;
	msgNumber?: string;
	msgType?: string;
	msgDate?: string;
	msgVersion?: string;
}

interface EinvoicepmtSupplierDto {
	id?: number;
	gln: string;
	name: string;
	address: string;
	unp: string;
	okpo?: string;
	accountNumber: string;
	bankName: string;
	bankAddress: string;
	bankCode: string;
}

interface EinvoicepmtBuyerDto {
	id?: number;
	gln: string;
	name: string;
	address: string;
	unp: string;
	okpo?: string;
	accountNumber: string;
	bankName: string;
	bankAddress: string;
	bankCode: string;
}

export interface EinvoicepmtShipperDto {
	id?: number;
	gln?: string;
	name?: string;
	address?: string;
	unp?: string;
}

interface EinvoicepmtReceiverDto {
	id?: number;
	gln?: string;
	name?: string;
	address?: string;
	unp?: string;
}

export interface EinvoicepmtFormValue {
	id: number;
	common: EinvoicepmtCommonFormValue;
	supplier: EinvoicepmtSupplierFormValue;
	buyer: EinvoicepmtBuyerFormValue;
	shipper: EinvoicepmtShipperValue;
	receiver: EinvoicepmtReceiverValue;
	additionalFields: {
		fields: ExtraFieldForm[];
	};
	products: {
		products: EinvoicepmtProductFormValue[];
		totalSums: TotalSumsForm;
	};
}

interface EinvoicepmtCommonFormValue {
	processingStatus: number;
	dateCreate: string;
	invoicepmtNumber1: string;
	invoicepmtNumber2: string;
	invoicepmtNumber3: string;
	invoicepmtDate: string;
	contractNumber: string;
	contractDate: string;
	currency: string;
	expireDate: string;
	paymentTerm: string;
	purchaseTarget: string;
	deliveryTerms: string;
	validity: string;
	deliveryTime: string;
	testIndicator: boolean;
}

interface EinvoicepmtSupplierFormValue {
	supplierName: string;
	supplierAddress: string;
	supplierGln: string;
	supplierUnp: string;
	supplierOkpo: string;
	supplierAccountNumber: string;
	supplierBankName: string;
	supplierBankAddress: string;
	supplierBankCode: string;
}

interface EinvoicepmtBuyerFormValue {
	buyerName: string;
	buyerAddress: string;
	buyerGln: string;
	buyerUnp: string;
	buyerOkpo: string;
	buyerAccountNumber: string;
	buyerBankName: string;
	buyerBankAddress: string;
	buyerBankCode: string;
}

export interface EinvoicepmtProductDto {
	position: string;
	gtin: string;
	fullName: string;
	uom: UnitOfMeasure;
	// quantity: string;
	priceNet: string;
	amountWithoutVat: string;
	vatRate: string;
	amountVat: string;
	amountWithVat: string;
	addInfo: string;
	codeByBuyer: string;
	codeBySupplier: string;
	msgEinvoicepmtExtraFieldList: ExtraFieldForm[];
	quantityDespatch: string;
}

interface EinvoicepmtShipperValue {
	shipperName: string;
	shipperAddress: string;
	shipperGln: string;
	shipperUnp: string;
}

interface EinvoicepmtReceiverValue {
	receiverName: string;
	receiverAddress: string;
	receiverGln: string;
	receiverUnp: string;
}

export interface EinvoicepmtProductFormValue {
	position: string;
	gtin: string;
	fullName: string;
	uom: UnitOfMeasure;
	quantityDespatch: string;
	codeByBuyer: string;
	codeBySupplier: string;
	addInfo: string;
	priceNet: string;
	vatRate: string;
	amountWithVat: string;
	amountVat: string;
	amountWithoutVat: string;
	autoSum: boolean;
	msgEinvoicepmtExtraFieldList: ExtraFieldForm[];
}

interface TotalSumsForm {
	quantity: string;
	amountVat: string;
	amountWithVat: string;
	amountWithoutVat: string;
	isAutoSum: boolean;
}

export interface ExtraFieldForm {
	dictionary?: ExtraFieldForm;
	fieldName?: string;
	fieldCode?: string;
	fieldValue?: string;
}

export interface EinvoicepmtPartner extends Partner {
	bankName: string;
	bankAddress: string;
	bankCode: string;
	accountNumber: string;
}
