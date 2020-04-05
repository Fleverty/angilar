import { Action, createReducer, on } from "@ngrx/store";
import * as OrdersActions from "./order.actions";
import { Currency } from "@helper/abstraction/currency";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { OrderKind, OrderParams } from "@helper/abstraction/order";
import { Partner } from "@helper/abstraction/partners";
import { Storage } from "@helper/abstraction/storages";

export interface OrdersState {
	mode: "EDIT" | "CREATE";
	status: "PENDING" | "OK" | "SAVE" | "ERROR";
	currencies?: Currency[];
	unitsOfMeasures?: UnitOfMeasure[];
	deliveryStorages?: Storage[];
	order?: OrderParams;
	orderDraftId?: number;
	buyers?: Partner[];
	suppliers?: Partner[];
	kind?: OrderKind;
	error?: Error;
}

const initialState: OrdersState = {
	mode: "CREATE",
	status: "OK",
};

const ordersReducer = createReducer(
	initialState,
	on(OrdersActions.setMode, (state, { mode }): OrdersState => ({ ...state, mode })),
	on(OrdersActions.resetCurrencies, (state): OrdersState => ({ ...state, currencies: undefined })),
	on(OrdersActions.getCurrenciesSuccess, (state, { currencies }): OrdersState => ({ ...state, currencies })),
	on(OrdersActions.saveOrderDraftSuccess, (state, { orderDraftId }): OrdersState => ({ ...state, orderDraftId })),
	on(OrdersActions.getUnitOfMeasuresSuccess, (state, { unitsOfMeasures }): OrdersState => ({ ...state, unitsOfMeasures })),
	on(OrdersActions.getUnitOfMeasuresError, (state, { error }): OrdersState => ({ ...state, error })),
	on(OrdersActions.resetUnitOfMeasures, (state): OrdersState => ({ ...state, unitsOfMeasures: undefined })),
	on(OrdersActions.setOrderKind, (state, { kind }) => ({ ...state, kind })),
	on(OrdersActions.getBuyers, (state): OrdersState => ({ ...state })),
	on(OrdersActions.getBuyersSuccess, (state, { buyers }): OrdersState => ({ ...state, buyers })),
	on(OrdersActions.getBuyersFailed, (state, { error }): OrdersState => ({ ...state, error })),
	on(OrdersActions.resetBuyers, (state): OrdersState => ({ ...state, buyers: undefined })),
	on(OrdersActions.getSuppliers, (state): OrdersState => ({ ...state })),
	on(OrdersActions.getSuppliersSuccess, (state, { suppliers }): OrdersState => ({ ...state, suppliers })),
	on(OrdersActions.getSuppliersFailed, (state, { error }): OrdersState => ({ ...state, error })),
	on(OrdersActions.resetSuppliers, (state): OrdersState => ({ ...state, suppliers: undefined })),
	on(OrdersActions.getDeliveryStoragesSuccess, (state, { deliveryStorages }): OrdersState => ({ ...state, deliveryStorages })),
	on(OrdersActions.getDeliveryStoragesFailed, (state, { error }): OrdersState => ({ ...state, error })),
	on(OrdersActions.resetDeliveryStorages, (state): OrdersState => ({ ...state, deliveryStorages: undefined })),
	on(OrdersActions.getOrderDraftSuccess, (state, { order }): OrdersState => ({ ...state, order })),
	on(OrdersActions.getOrderSuccess, (state, { order }): OrdersState => ({ ...state, order })),
	on(OrdersActions.resetOrder, (state, { order }): OrdersState => ({ ...state, order })),
	on(OrdersActions.getOrdersResponseDraftSuccess, (state, { order }): OrdersState => ({ ...state, order })),
	on(OrdersActions.deleteOrderError, (state, { error }): OrdersState => ({ ...state, error })),
	on(OrdersActions.saveOrderDraft, (state): OrdersState => ({ ...state, status: "SAVE" })),
	on(OrdersActions.saveOrderResponseDraft, (state): OrdersState => ({ ...state, status: "SAVE" })),
	on(OrdersActions.sendOrderDraftWithValidation, (state): OrdersState => ({ ...state, status: "SAVE" })),
	on(OrdersActions.sendOrderResponseDraftWithValidation, (state): OrdersState => ({ ...state, status: "SAVE" })),
	on(OrdersActions.saveOrderDraftSuccess, (state): OrdersState => ({ ...state, status: "OK" })),
	on(OrdersActions.saveOrderResponseDraftSuccess, (state): OrdersState => ({ ...state, status: "OK" })),
	on(OrdersActions.saveOrderDraftFailed, (state): OrdersState => ({ ...state, status: "ERROR" })),
	on(OrdersActions.creatingWithValidationError, (state): OrdersState => ({ ...state, status: "ERROR" })),
	on(OrdersActions.saveOrderResponseDraftFailed, (state): OrdersState => ({ ...state, status: "ERROR" })),
	on(OrdersActions.sendOrderDraft, (state): OrdersState => ({ ...state, status: "PENDING" })),
	on(OrdersActions.sendOrderDraftSuccess, (state): OrdersState => ({ ...state, status: "OK" })),
	on(OrdersActions.sendOrderDraftFailed, (state): OrdersState => ({ ...state, status: "ERROR" })),
);

export function reducer(state: OrdersState | undefined, action: Action): OrdersState {
	return ordersReducer(state, action);
}
