import { LoadingPoint } from "@helper/abstraction/loading-points";
import { GeneralGLN } from "@helper/abstraction/generalGLN";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { Currency } from "@helper/abstraction/currency";
import { Consignee } from "@helper/abstraction/consignee";
import { EwaybillAttachedDocumentsForm } from "../ewaybill-attached-documents/ewaybill-attached-documents.component";
import { ExtraFieldForm } from "../ewaybill-extra-information/ewaybill-extra-information.component";
import { ProductDocumentInformation } from "@helper/abstraction/ewaybill";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";

export interface ExpandedConsignee extends Consignee {
	type?: undefined;
}

export interface EwaybillParticipantForm {
	id: number;
	dictionary: ExpandedConsignee;
	gln: string;
	name: string;
	address: string;
	unp: string;
}

export interface EwaybillCommonForm {
	contractDate?: Date;
	contractName?: string;
	contractNumber?: string;
	currency?: Currency;
	deliveryNoteDate?: Date;
	number?: string;
	ordersNumber?: string;
	processingStatus?: string;
	seria01: string;
	seria02: string;
}

export interface EwaybillDetailsForm {
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

export interface EwaybillPlacesForm {
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

export interface EwaybillProductForm {
	position: number;
	gtin: string;
	codeByBuyer: string;
	codeBySupplier: string;
	fullName: string;
	uom: UnitOfMeasure;
	quantityDespatch: number;
	priceNet: number;
	priceManufacturer: number;
	discountBulkRate: number;
	discountRate: number;
	vatRate: number;
	amountExcise: number;
	quantityDespatchLu: number;
	grossWeight: number;
	countryOfOrigin: Country;
	expireDate: Date;
	addInfo: string;
	msgEwaybillItemCertList: ProductDocumentInformation[];
	msgEwaybillExtraFieldList: ExtraFieldForm[];
	amountVat: number;
	amountWithVat: number;
	amountWithoutVat: number;
	autoSum: boolean;
}

export interface TotalSumsForm {
	quantityDespatch: string;
	priceNet: string;
	amountVat: string;
	amountExcise: string;
	vatRate: string;
	amountWithVat: string;
	amountWithoutVat: string;
	quantityDespatchLu: string;
	grossWeight: string;
	isAutoSum: boolean;
}

export interface EwaybillForm {
	id?: string;
	testIndicator: boolean;
	common: EwaybillCommonForm;
	details: EwaybillDetailsForm;
	attached: { documents: EwaybillAttachedDocumentsForm[] };
	extras: { documents: ExtraFieldForm[] };
	places: EwaybillPlacesForm;

	customer?: EwaybillParticipantForm;
	сonsignee: EwaybillParticipantForm;
	shipper: EwaybillParticipantForm;
	products: { products: EwaybillProductForm[]; totalSums: TotalSumsForm };
}
