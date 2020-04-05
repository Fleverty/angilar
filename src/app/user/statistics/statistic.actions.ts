import { createAction } from "@ngrx/store";
import { StatisticEwaybillDocument, StatisticEwaybillParams, Shipper, StatisticRequestFilterParams, DeliveryPlaceFilter, DeliveryPointStatistic, StatisticOrderParams, StatisticOrdersDto } from "@helper/abstraction/statistic";
import { HttpErrorResponse } from "@angular/common/http";
import { DocumentProperty, DocumentType } from "@helper/abstraction/documents";
import { Status } from "@helper/abstraction/status";

// -------------------------- ACTIONS WITH DOCUMENTS --------------------------
export const updateStatisticFilter = createAction(
	"[Statistic] Update Statistic Filter",
	(payload: StatisticEwaybillParams): { statisticFilterParams: StatisticEwaybillParams } => ({ statisticFilterParams: payload })
);

export const resetDocuments = createAction(
	"[Statistic] Reset Documents",
	(): { documents: undefined } => ({ documents: undefined })
);

export const getEwaybillDocuments = createAction(
	"[Statistic] Get Ewaybill Documents",
	(payload: StatisticEwaybillParams): { statisticParams: StatisticEwaybillParams } => ({ statisticParams: payload })
);

export const getDocumentsSuccess = createAction(
	"[Statistic] Get Documents Success",
	(payload: StatisticEwaybillDocument[]): { documents: StatisticEwaybillDocument[] } => ({ documents: payload })
);

export const getDocumentsError = createAction(
	"[Statistic] Get Documents Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const getOrdersDocuments = createAction(
	"[Statistic] Get Orders Documents",
	(payload: StatisticOrderParams): { statisticParams: StatisticOrderParams } => ({ statisticParams: payload })
);

export const getOrdersDocumentsSuccess = createAction(
	"[Statistic] Get Orders Success",
	(payload: StatisticOrdersDto): { documents: StatisticOrdersDto } => ({ documents: payload })
);

export const getOrdersDocumentsError = createAction(
	"[Statistic] Get Orders Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const switchStatisticProperties = createAction(
	"[Document] Switch Statistic Properties",
	(payload: Extract<DocumentType, "EWAYBILL" | "ORDERS">): { documentTypeId: Extract<DocumentType, "EWAYBILL" | "ORDERS"> } => ({ documentTypeId: payload })
);

export const setStatisticProperties = createAction(
	"[Statistic] Set Statistic Properties",
	(payload: DocumentProperty[]): { currentStatisticProperties: DocumentProperty[] } => ({ currentStatisticProperties: payload })
);

export const pushSelectedItems = createAction(
	"[Statistic] Push Selected Items",
	(payload: StatisticEwaybillDocument[]): { selectedItems: StatisticEwaybillDocument[] } => ({ selectedItems: payload })
);

export const resetSelectedItems = createAction(
	"[Statistic] Reset Selected Items",
	(): { selectedItems: StatisticEwaybillDocument[] } => ({ selectedItems: [] })
);


// -------------------------- ACTIONS WITH SHIPPER--------------------------
export const getShipper = createAction(
	"[Statistic] Next Shipper Filter",
	(payload: StatisticRequestFilterParams): { filter: StatisticRequestFilterParams } => ({ filter: payload })
);

export const resetShipper = createAction(
	"[Statistic] Reset Shipper",
	(): { shipper: undefined } => ({ shipper: undefined })
);

export const getShipperSuccess = createAction(
	"[Statistic] Get Shipper Success",
	(payload: Shipper[]): { shipper: Shipper[] } => ({ shipper: payload })
);

export const getShipperError = createAction(
	"[Statistic] Get Shipper Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------------- ACTIONS WITH RECEIVER--------------------------
export const getReceiver = createAction(
	"[Statistic] Next Receiver Filter",
	(payload: StatisticRequestFilterParams): { filter: StatisticRequestFilterParams } => ({ filter: payload })
);

export const resetReceiver = createAction(
	"[Statistic] Reset Receiver",
	(): { receiver: undefined } => ({ receiver: undefined })
);

export const getReceiverSuccess = createAction(
	"[Statistic] Get Receiver Success",
	(payload: Shipper[]): { receiver: Shipper[] } => ({ receiver: payload })
);

export const getReceiverError = createAction(
	"[Statistic] Get Receiver Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------------- ACTIONS WITH PARTIES--------------------------
export const getParties = createAction(
	"[Statistic] Next Parties Filter",
	(payload: StatisticRequestFilterParams): { filter: StatisticRequestFilterParams } => ({ filter: payload })
);

export const resetParties = createAction(
	"[Statistic] Reset Parties",
	(): { party: undefined } => ({ party: undefined })
);

export const getPartiesSuccess = createAction(
	"[Statistic] Get Parties Success",
	(payload: Shipper[]): { party: Shipper[] } => ({ party: payload })
);

export const getPartiesError = createAction(
	"[Statistic] Get Parties Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------------- ACTIONS WITH PROCESSING STATUSES --------------------------
export const updateStatusesFilter = createAction(
	"[Statistic] Next Statuses Filter",
	(payload: DocumentType): { documentTypeId: DocumentType } => ({ documentTypeId: payload })
);

export const resetStatuses = createAction(
	"[Statistic] Reset Statuses",
	(): { statuses: undefined } => ({ statuses: undefined })
);

export const getStatusesSuccess = createAction(
	"[Statistic] Get Statuses Success",
	(payload: Status[]): { statuses: Status[] } => ({ statuses: payload })
);

export const getStatusesError = createAction(
	"[Statistic] Get Statuses Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------------- ACTIONS WITH LOADING POINT --------------------------
export const getLoadingPoints = createAction(
	"[Statistic] Get Loading Points",
	(payload: DeliveryPlaceFilter): { statisticFilterParams: DeliveryPlaceFilter } => ({ statisticFilterParams: payload })
);

export const getLoadingPointsError = createAction(
	"[Statistic] Get Loading Points Error",
	(payload: Error): { statisticError: Error } => ({ statisticError: payload })
);

export const getLoadingPointsSuccess = createAction(
	"[Statistic] Get Loading Points Success",
	(payload: DeliveryPointStatistic[]): { loadingPoints: DeliveryPointStatistic[] } => ({ loadingPoints: payload })
);

export const resetLoadingPoints = createAction(
	"[Statistic] Reset Loading Points",
	(): { loadingPoints: undefined } => ({ loadingPoints: undefined })
);

// -------------------------- ACTIONS WITH UNLOADING POINT --------------------------
export const getUnloadingPoints = createAction(
	"[Statistic] Get Unloading Points",
	(payload: DeliveryPlaceFilter): { statisticFilterParams: DeliveryPlaceFilter } => ({ statisticFilterParams: payload })
);

export const getUnloadingPointsError = createAction(
	"[Statistic] Get Unloading Points Error",
	(payload: Error): { statisticError: Error } => ({ statisticError: payload })
);

export const getUnloadingPointsSuccess = createAction(
	"[Statistic] Get Unloading Points Success",
	(payload: DeliveryPointStatistic[]): { unloadingPoints: DeliveryPointStatistic[] } => ({ unloadingPoints: payload })
);

export const resetUnloadingPoints = createAction(
	"[Statistic] Reset Unloading Points",
	(): { unloadingPoints: undefined } => ({ unloadingPoints: undefined })
);

// -------------------------- ACTIONS WITH DELIVERY POINTS --------------------------
export const getDeliveryPoints = createAction(
	"[Statistic] Get Delivery Points",
	(payload: DeliveryPlaceFilter): { statisticFilterParams: DeliveryPlaceFilter } => ({ statisticFilterParams: payload })
);

export const getDeliveryPointsError = createAction(
	"[Statistic] Get Delivery Points Error",
	(payload: Error): { statisticError: Error } => ({ statisticError: payload })
);

export const getDeliveryPointsSuccess = createAction(
	"[Statistic] Get Delivery Points Success",
	(payload: DeliveryPointStatistic[]): { deliveryPoints: DeliveryPointStatistic[] } => ({ deliveryPoints: payload })
);

export const resetDeliveryPoints = createAction(
	"[Statistic] Reset Delivery Points",
	(): { deliveryPoints: undefined } => ({ deliveryPoints: undefined })
);
