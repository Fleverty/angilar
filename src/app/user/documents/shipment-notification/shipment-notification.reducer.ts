import { Action, createReducer, on } from "@ngrx/store";
import * as ShipmentNotifications from "./shipment-notification.actions";
import { Partner } from "@helper/abstraction/partners";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";
import { ShipmentNotificationProduct } from "@helper/abstraction/shipment-notification";
import { Storage } from "@helper/abstraction/storages";
import { TotalSums } from "@app/user/documents/shipment-notification/total-sums";
import { ShipmentNotification } from "./shipment-notification";

type Status = "ERROR" | "PENDING" | "OK";

export interface ShipmentNotificationsState {
	shipmentNotification?: ShipmentNotification;
	status: Status;
	buyers?: Partner[];
	unitsOfMeasures?: UnitOfMeasure[];
	countries?: Country[];
	error?: Error;
	products: ShipmentNotificationProduct[];
	deliveryStorages?: Storage[];
	shipmentPlaces?: Storage[];
	totalSums: TotalSums;
	isAutoSum: boolean;
	autoShipmentNotificationNumber?: string;
}

const initialState: ShipmentNotificationsState = {
	status: "OK",
	products: [],
	totalSums: new TotalSums(),
	isAutoSum: true,
};

const shipmentNotificationReducer = createReducer(
	initialState,
	on(ShipmentNotifications.resetShipmentNotifications, (): ShipmentNotificationsState => ({ ...initialState })),
	on(ShipmentNotifications.getBuyers, (state): ShipmentNotificationsState => ({
		...state,
		status: "PENDING"
	})),
	on(ShipmentNotifications.getBuyersSuccess, (state, { buyers }): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		buyers
	})),
	on(ShipmentNotifications.getBuyersFailed, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.resetBuyers, (state): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		buyers: undefined
	})),
	on(ShipmentNotifications.updateUnitOfMeasuresFilter, (state): ShipmentNotificationsState => ({
		...state,
		status: "PENDING"
	})),
	on(ShipmentNotifications.getUnitOfMeasuresSuccess, (state, { unitsOfMeasures }): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		unitsOfMeasures
	})),
	on(ShipmentNotifications.getUnitOfMeasuresError, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.resetUnitOfMeasures, (state): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		unitsOfMeasures: undefined
	})),
	on(ShipmentNotifications.getCountriesSuccess, (state, { countries }): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		countries
	})),
	on(ShipmentNotifications.getCountriesError, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.resetCountries, (state): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		countries: undefined
	})),
	on(ShipmentNotifications.addProduct, (state, { product }): ShipmentNotificationsState => {
		const newProduct = { ...product, position: state.products.length };
		return {
			...state,
			products: [...state.products, newProduct],
			totalSums: state.isAutoSum ? state.totalSums.calculate([...state.products, product] as ShipmentNotificationProduct[]) : state.totalSums
		};
	}),
	on(ShipmentNotifications.getDeliveryStorages, (state): ShipmentNotificationsState => ({
		...state,
		status: "PENDING"
	})),
	on(ShipmentNotifications.getDeliveryStoragesSuccess, (state, { deliveryStorages }): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		deliveryStorages
	})),
	on(ShipmentNotifications.getDeliveryStoragesFailed, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.resetDeliveryStorages, (state): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		deliveryStorages: undefined
	})),
	on(ShipmentNotifications.getShipmentPlaces, (state): ShipmentNotificationsState => ({
		...state,
		status: "PENDING"
	})),
	on(ShipmentNotifications.getShipmentPlacesSuccess, (state, { shipmentPlaces }): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		shipmentPlaces
	})),
	on(ShipmentNotifications.getShipmentPlacesFailed, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.resetShipmentPlaces, (state): ShipmentNotificationsState => ({
		...state,
		status: "OK",
		shipmentPlaces: undefined
	})),
	on(ShipmentNotifications.saveShipmentNotificationSuccess, (state): ShipmentNotificationsState => ({ ...state, status: "OK", products: [] })),
	on(ShipmentNotifications.saveShipmentNotificationFailed, (state, { error }): ShipmentNotificationsState => ({
		...state,
		status: "ERROR",
		error
	})),
	on(ShipmentNotifications.editProduct, (state, { newProduct }) => {
		const products = [...state.products];
		products[newProduct.position] = newProduct;
		return {
			...state,
			products,
			totalSums: state.isAutoSum ? state.totalSums.calculate(products as ShipmentNotificationProduct[]) : state.totalSums
		};
	}),
	on(ShipmentNotifications.setDocuments, (state, { products }) => ({
		...state,
		products,
		totalSums: state.totalSums.calculate(products as ShipmentNotificationProduct[])
	})),
	on(ShipmentNotifications.resetProducts, (state): ShipmentNotificationsState => ({ ...state, products: [], totalSums: new TotalSums() })),
	on(ShipmentNotifications.setTotalIsAuto, (state, { isAutoSum, totalSums }): ShipmentNotificationsState => {
		const totalSum = new TotalSums({
			...state.totalSums,
			amountVat: totalSums.amountVat,
			amountWithVat: totalSums.amountWithVat,
			amountWithoutVat: totalSums.amountWithoutVat,
		});

		return {
			...state,
			isAutoSum,
			totalSums: isAutoSum ? state.totalSums.calculate(state.products) : totalSum
		};
	}),
	on(ShipmentNotifications.getShipmentNotificationDocumentSuccess, (state, { shipmentNotification }): ShipmentNotificationsState => ({ ...state, shipmentNotification })),
	on(ShipmentNotifications.getShipmentNotificationDraftSuccess, (state, { shipmentNotification }): ShipmentNotificationsState => ({ ...state, shipmentNotification })),
	on(ShipmentNotifications.getShipmentNotificationDocumentError, (state, { error }): ShipmentNotificationsState => ({ ...state, status: "ERROR", error })),
	on(ShipmentNotifications.exportShipmentNotificationXMLError, (state, { error }): ShipmentNotificationsState => ({ ...state, status: "ERROR", error })),
	on(ShipmentNotifications.getShipmentNotificationDraftNumberSuccess, ((state, { shipmentNotificationDraftNumber }): ShipmentNotificationsState => ({ ...state, autoShipmentNotificationNumber: shipmentNotificationDraftNumber })))
);

export function reducer(state: ShipmentNotificationsState | undefined, action: Action): ShipmentNotificationsState {
	return shipmentNotificationReducer(state, action);
}
