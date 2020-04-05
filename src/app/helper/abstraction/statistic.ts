import { DocumentType, MessageType } from "./documents";
import { FilterRequestParams } from "./filter";
import { Status } from "./status";

export interface Shipper {
	id: string;
	name: string;
	description: string;
}

export type ShipperDto = Shipper[];

export interface FilterDataDto<T> {
	filterFieldDtos: T[];
	totalCount: number;
	totalPages: number;
}

export interface StatisticRequestFilterParams extends FilterRequestParams {
	fieldName: "RECEIVER_ID" | "SHIPPER_ID";
	keyWord?: string;
}

export interface StatisticEwaybillFormValue {
	shipper?: Shipper[];
	consignee?: Shipper[];
	loadingPoints?: DeliveryPointStatistic[];
	unloadingPoints?: DeliveryPointStatistic[];
	seriesAndNumber?: string;
	deliveryPeriod?: [Date, Date];
	processingStatus?: Status[];
	contractNumber?: string;
	testIndicator?: "all" | "test" | "untest";
}

export interface StatisticOrdersFormValue {
	parties?: any[];
	deliveryPoints?: any[];
	documentNumber?: string;
	deliveryPeriod?: [Date, Date];
	orderDirection?: "all" | "0" | "1";
}

export interface StatisticFilterParams {
	startDate: Date;
	endDate: Date;
	page: number;
	size: number;
	documentType?: Extract<DocumentType, "EWAYBILL" | "ORDERS">;
}

export interface StatisticEwaybillParams extends StatisticFilterParams {
	contractNumber?: string;
	deliveryNoteNumber?: string;
	processingStatuses?: string[];
	receiverIds?: number[];
	shipperIds?: number[];
	shipsFromGln?: string[];
	shipsToGln?: string[];
	testIndicator?: boolean;
}

export interface StatisticOrderParams extends StatisticFilterParams {
	deliveryPointGln?: string[];
	documentNumber?: string;
	orderDirection?: "1" | "0";
	partyIds?: number[];
}

export interface StatisticEwaybillDocument {
	id: number;
	dateCreate: Date;
	deliveryNoteNumber: string;
	documentDate: Date;
	contractNumber: string;
	msgType: MessageType;
	testIndicator: boolean;
	processingStatus: string;
	shipForm: {
		id: number;
		gln: string;
		address: string;
	};
	shipTo: {
		id: number;
		gln: string;
		address: string;
	};
	shipper: {
		id: number;
		name: string;
	};
	receiver: {
		id: number;
		name: string;
	};
}

export type StatisticEwaybillDto = StatisticEwaybillDocument[];

export interface StatisticOrdersListElement {
	date: Date;
	id: number;
	number: string;
}
export interface StatisticOrdersDocument {
	id: number;
	buyerGln: string;
	buyerId: number;
	buyerName: string;
	deliveryPointAddress: string;
	deliveryPointGln: string;
	deliveryPointId: string;
	desadvList: StatisticOrdersListElement[];
	order: StatisticOrdersListElement;
	orderspList: StatisticOrdersListElement[];
	supplierGln: string;
	supplierId: number;
	supplierName: string;
}

export type StatisticOrdersDto = StatisticOrdersDocument[];

export interface DeliveryPointStatistic {
	id: number;
	gln: string;
	relatedPartyId: number;
	relatedPartyName: string;
	addressFull: string;
	active: boolean;
}

export interface DeliveryPlaceFilter extends FilterRequestParams {
	relatedPartyId: number[];
	storageGln?: string;
	storageAddressFull?: string;
}
