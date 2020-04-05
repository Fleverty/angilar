import { LoadingPoint } from "@helper/abstraction/loading-points";
import { GeneralGLN } from "@helper/abstraction/generalGLN";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { Currency } from "@helper/abstraction/currency";
import { ExtraFieldForm } from "./einvoice-extra-information/einvoice-extra-information.component";
import { Consignee } from "@helper/abstraction/consignee";
import { EinvoiceDataDto } from "@helper/abstraction/einvoice";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";


export interface EinvoiceCommonForm {
	contractDate?: Date;
	contractName?: string;
	contractNumber?: string;
	currency?: Currency;
	dateCreate?: Date;
	number?: string;
	ordersNumber?: string;
	processingStatus?: string;
	seria01: string;
	seria02: string;
	purport: string;
	paymentBeginDate: Date;
	paymentEndDate: Date;
	invoiceDate: Date;
	testIndicator?: boolean;
}

export interface EinvoiceSupplierForm {
	supplierId: number;
	supplierName: string;
	supplierGln: string;
	supplierUnp: string;
	supplierAddress: string;
	supplierBankName: string;
	supplierBankCode: string;
	supplierBankAddress: string;
	supplierAccountNumber: string;
}

export interface EinvoiceBuyerForm {
	buyerId: number;
	buyerName?: {
		id: number;
		gln?: string;
		name?: string;
		unp?: string;
		addressFull?: string;
	};
	buyerGln: string;
	buyerUnp: string;
	buyerAddress: string;
	buyerAccountNumber: string;
	buyerBankName: string;
	buyerBankCode: string;
	buyerBankAddress: string;
}

export interface ExpandedConsignee extends Consignee {
	type?: undefined;
}

export interface EinvoiceParticipantForm {
	id: number;
	dictionary: ExpandedConsignee;
	gln: string;
	name: string;
	address: string;
	unp: string;
}

export interface EinvoiceDetailsForm {
	contractDate?: Date;
	contractName?: string;
	contractNumber?: string;
	deliveryContact?: string;
	partyIssuingProxyName?: string;
	proxyDate?: Date;
	proxyNumber?: string;
	quantityTrip?: string;
	shipFromContact?: string;
	shipperContact?: string;
	shipperSealNumber?: string;
	trailerNumber?: string;
	transportContact?: string;
	transportNumber?: string;
	transportOwnerName?: string;
	waybillNumber?: string;
	baseShippingDocumentName?: string;
	baseShippingDocumentNumber?: string;
	baseShippingDocumentDate?: Date;
}

export interface EinvoicePlacesForm {
	loading: {
		address: string;
		gln: string;
		isPublicGln: boolean;
		loadingPoint: LoadingPoint;
		publicGln: GeneralGLN;
	};
	unloading: {
		address: string;
		unloadingPoint: UnloadingPoint;
		gln: string;
		isPublicGln: boolean;
		publicGln: GeneralGLN;
	};
}

export interface EinvoiceProductForm {
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
	autoSum: boolean;
}

export interface TotalSumsForm {
	quantity: string;
	priceNet: string;
	amountVat: string;
	amountExcise: string;
	vatRate: string;
	amountWithVat: string;
	amountWithoutVat: string;
	isAutoSum: boolean;
}

export interface EinvoiceForm {
	id?: number;
	supplierData: EinvoiceDataDto;
	common: EinvoiceCommonForm;
	supplier: EinvoiceSupplierForm;
	buyer: EinvoiceBuyerForm;
	shipper: EinvoiceParticipantForm;
	consignee: EinvoiceParticipantForm;
	places: EinvoicePlacesForm;
	extras: { documents: ExtraFieldForm[] };
	products: { products: EinvoiceProductForm[]; totalSums: TotalSumsForm };
}
