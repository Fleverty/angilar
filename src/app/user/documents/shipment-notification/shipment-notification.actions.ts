import { createAction } from "@ngrx/store";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { Storage, TypedStoragesParams } from "@helper/abstraction/storages";
import { UnitOfMeasure, UnitOfMeasuresParams } from "@helper/abstraction/unit-of-measures";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import {
	ShipmentNotificationProduct,
	ShipmentNotificationFormValue
} from "@helper/abstraction/shipment-notification";
import { TotalSums } from "@app/user/documents/shipment-notification/total-sums";
import { DraftType } from "@helper/abstraction/draft";
import { ShipmentNotification } from "./shipment-notification";
import { HttpErrorResponse } from "@angular/common/http";

export const getBuyers = createAction(
	"[Shipment Notifications] Get Buyers",
	(payload: PartnersParams): { filter: PartnersParams } => ({ filter: payload })
);

export const getBuyersSuccess = createAction(
	"[Shipment Notifications] Get Buyers Success",
	(payload: Partner[]): { buyers: Partner[] } => ({ buyers: payload })
);

export const getBuyersFailed = createAction(
	"[Shipment Notifications] Get Buyers Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetShipmentNotifications = createAction("[Shipment Notifications] Reset Shipment Notifications");

export const resetBuyers = createAction(
	"[Shipment Notifications] Reset Buyers"
);

export const getShipmentPlaces = createAction(
	"[Shipment Notifications] Get Shipment Places",
	(payload: TypedStoragesParams): { filter: TypedStoragesParams } => ({ filter: payload })
);

export const getShipmentPlacesSuccess = createAction(
	"[Shipment Notifications] Get Shipment Places Success",
	(payload: Storage[]): { shipmentPlaces: Storage[] } => ({ shipmentPlaces: payload })
);

export const getShipmentPlacesFailed = createAction(
	"[Shipment Notifications] Get Shipment Places Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetShipmentPlaces = createAction(
	"[Shipment Notifications] Reset Shipment Places"
);

export const updateUnitOfMeasuresFilter = createAction(
	"[Shipment Notifications] Next Unit Of Measures Filter",
	(payload: UnitOfMeasuresParams): { filter: UnitOfMeasuresParams } => ({ filter: payload })
);

export const resetUnitOfMeasures = createAction(
	"[Shipment Notifications] Reset Unit Of Measures"
);

export const getUnitOfMeasuresSuccess = createAction(
	"[Shipment Notifications] Get Unit Of Measures Success",
	(payload: UnitOfMeasure[]): { unitsOfMeasures: UnitOfMeasure[] } => ({ unitsOfMeasures: payload })
);

export const getUnitOfMeasuresError = createAction(
	"[Shipment Notifications] Get Unit Of Measures Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const updateCountriesFilter = createAction(
	"[Shipment Notifications] Next Countries Filter",
	(payload: CountriesParams): { filter: CountriesParams } => ({ filter: payload })
);

export const resetCountries = createAction(
	"[Shipment Notifications] Reset Countries"
);

export const getCountriesSuccess = createAction(
	"[Shipment Notifications] Get Countries Success",
	(payload: Country[]): { countries: Country[] } => ({ countries: payload })
);

export const getCountriesError = createAction(
	"[Shipment Notifications] Get Countries Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const addProduct = createAction(
	"[Shipment Notifications] Add Product",
	(payload: ShipmentNotificationProduct): { product: ShipmentNotificationProduct } => ({ product: payload })
);

export const editProduct = createAction(
	"[Shipment Notifications] Edit Product",
	(payload: ShipmentNotificationProduct): { newProduct: ShipmentNotificationProduct } => ({ newProduct: payload })
);

export const resetProducts = createAction(
	"[Shipment Notifications] Reset Products"
);

export const getDeliveryStorages = createAction(
	"[Shipment Notifications] Get Delivery Storages",
	(payload: TypedStoragesParams): { filter: TypedStoragesParams } => ({ filter: payload })
);

export const getDeliveryStoragesSuccess = createAction(
	"[Shipment Notifications] Get Delivery Storages Success",
	(payload: Storage[]): { deliveryStorages: Storage[] } => ({ deliveryStorages: payload })
);

export const getDeliveryStoragesFailed = createAction(
	"[Shipment Notifications] Get Delivery Storages Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetDeliveryStorages = createAction(
	"[Shipment Notifications] Reset Delivery Places"
);

export const saveShipmentNotification = createAction(
	"[Shipment Notifications] Save Notification",
	(payload: ShipmentNotificationFormValue): { shipmentNotification: ShipmentNotificationFormValue } => ({ shipmentNotification: payload })
);

export const saveShipmentNotificationSuccess = createAction(
	"[Shipment Notifications] Save Notification Success",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveShipmentNotificationFailed = createAction(
	"[Shipment Notifications] Save Notification Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const setDocuments = createAction(
	"[Shipment Notifications] Set Documents",
	(payload: ShipmentNotificationProduct[]): { products: ShipmentNotificationProduct[] } => ({ products: payload })
);

export const setTotalIsAuto = createAction(
	"[Shipment Notifications] Set Total Sums Is Auto",
	(payload: boolean, totalSums: TotalSums): { isAutoSum: boolean; totalSums: TotalSums } => ({ isAutoSum: payload, totalSums: totalSums })
);

export const setCreatedShipmentNotificationId = createAction(
	"[Shipment Notifications] Set Created Id",
	(payload: number): { id: number } => ({ id: payload })
);

export const deleteShipmentNotificationDraft = createAction(
	"[Shipment Notification] Delete Draft",
	(payload: number[]): { idsToDelete: number[] } => ({ idsToDelete: payload })
);

export const deleteShipmentNotificationDraftSuccess = createAction(
	"[Shipment Notification] Delete Draft Success",
	(payload: number): { deletedCount: number } => ({ deletedCount: payload })
);

export const deleteShipmentNotificationDraftFailed = createAction(
	"[Shipment Notification] Delete Draft Success",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getShipmentNotificationDraft = createAction(
	"[Shipment Notification] Get Shipment Notification Draft",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const getShipmentNotificationDraftSuccess = createAction(
	"[Shipment Notification] Get Shipment Notification Draft Success",
	(payload: ShipmentNotification): { shipmentNotification: ShipmentNotification } => ({ shipmentNotification: payload })
);

export const getShipmentNotificationDraftError = createAction(
	"[Shipment Notification] Get Shipment Notification Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getShipmentNotificationDocument = createAction(
	"[Shipment Notification] Get Shipment Notification Document",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getShipmentNotificationDocumentSuccess = createAction(
	"[Shipment Notification] Get Shipment Notification Document Success",
	(payload: ShipmentNotification): { shipmentNotification: ShipmentNotification } => ({ shipmentNotification: payload })
);

export const getShipmentNotificationDocumentError = createAction(
	"[Shipment Notification] Get Shipment Notification Document Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const exportShipmentNotificationXMLError = createAction(
	"[Shipment Notification] Export Shipment Notification Xml Error",
	(payload: HttpErrorResponse | Error): { error: HttpErrorResponse | Error } => ({ error: payload })
);

export const sendShipmentNotificationDraft = createAction(
	"[Shipment Notification] Send Shipment Notification Draft",
	(payload: ShipmentNotificationFormValue): { shipmentNotification: ShipmentNotificationFormValue } => ({ shipmentNotification: payload })
);

export const sendShipmentNotificationDraftError = createAction(
	"[Shipment Notification] Send Shipment Notification Draft Error",
	(payload: HttpErrorResponse | Error): { error: HttpErrorResponse | Error } => ({ error: payload })
);

export const getShipmentNotificationDraftNumberSuccess = createAction(
	"[Shipment Notification] Send Shipment Notification Draft Error",
	(payload: string): { shipmentNotificationDraftNumber: string } => ({ shipmentNotificationDraftNumber: payload })
);
