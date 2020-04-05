import { createAction } from "@ngrx/store";
import { Currency, CurrenciesFilter } from "@helper/abstraction/currency";
import { OrderKind, OrderParams, EditOrderParams } from "@helper/abstraction/order";
import { UnitOfMeasure, UnitOfMeasuresParams } from "@helper/abstraction/unit-of-measures";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { Storage, TypedStoragesParams } from "@helper/abstraction/storages";
import { DraftType } from "@helper/abstraction/draft";
import { DocumentFromAnotherParams, DocumentKind } from "@helper/abstraction/documents";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { HttpErrorResponse } from "@angular/common/http";

export const setMode = createAction(
	"[Orders] Set Mode",
	(payload: "CREATE"): { mode: "CREATE" } => ({ mode: payload })
);

export const updateCurrenciesFilter = createAction(
	"[Orders] Next Currency Filter",
	(payload: CurrenciesFilter): { currenciesFilter: CurrenciesFilter } => ({ currenciesFilter: payload })
);

export const resetCurrenciesFilter = createAction("[Orders] Reset Currency Filter");

export const resetCurrencies = createAction("[Orders] Get Currency Success");

export const getCurrenciesSuccess = createAction(
	"[Orders] Get Currency Success",
	(payload: Currency[]): { currencies: Currency[] } => ({ currencies: payload })
);

export const getCurrenciesError = createAction(
	"[Orders] Get Currency Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const saveOrderDraft = createAction(
	"[Orders] Save Order Draft",
	(payload: Partial<OrderParams>): { orderParams: Partial<OrderParams> } => ({ orderParams: payload })
);

export const saveOrderDraftSuccess = createAction(
	"[Orders] Save Order Draft Success",
	(payload: number): { orderDraftId: number } => ({ orderDraftId: payload })
);

export const saveOrderDraftFailed = createAction(
	"[Orders] Save Order Draft Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const saveOrderResponseDraft = createAction(
	"[Orders] Save Order Response Draft",
	(payload: Partial<OrderParams>): { orderParams: Partial<OrderParams> } => ({ orderParams: payload })
);

export const saveOrderResponseDraftSuccess = createAction(
	"[Orders] Save Order Response Draft Success",
	(payload: number): { orderDraftId: number } => ({ orderDraftId: payload })
);

export const saveOrderResponseDraftFailed = createAction(
	"[Orders] Save Order Response Draft Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const sendOrderDraft = createAction(
	"[Orders] Send Order Draft",
	(payload: { draftType: DraftType; draftId: string }): { orderParams: { draftType: DraftType; draftId: string } } => ({ orderParams: payload })
);

export const sendOrderDraftWithValidation = createAction(
	"[Orders] Send Order Draft With Validation",
	(payload: DocumentKind): { orderParams: DocumentKind } => ({ orderParams: payload })
);

export const creatingWithValidationError = createAction(
	"[Orders] Сreating With Validation Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const sendOrderResponseDraftWithValidation = createAction(
	"[Orders] Send Order Response Draft With Validation",
	(payload: DocumentKind): { orderParams: DocumentKind } => ({ orderParams: payload })
);

export const sendOrderDraftSuccess = createAction(
	"[Orders] Send Order Draft Success",
);

export const sendOrderDraftFailed = createAction(
	"[Orders] Send Order Draft Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const updateUnitOfMeasuresFilter = createAction(
	"[Orders] Next Unit Of Measures Filter",
	(payload: UnitOfMeasuresParams): { filter: UnitOfMeasuresParams } => ({ filter: payload })
);

export const resetUnitOfMeasures = createAction(
	"[Orders] Reset Unit Of Measures"
);

export const getUnitOfMeasuresSuccess = createAction(
	"[Orders] Get Unit Of Measures Success",
	(payload: UnitOfMeasure[]): { unitsOfMeasures: UnitOfMeasure[] } => ({ unitsOfMeasures: payload })
);

export const getUnitOfMeasuresError = createAction(
	"[Orders] Get Unit Of Measures Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const setOrderKind = createAction(
	"[Orders] Set Order Kind",
	(payload: OrderKind): { kind: OrderKind } => ({ kind: payload })
);

export const getBuyers = createAction(
	"[Orders] Get Buyers",
	(payload: PartnersParams): { filter: PartnersParams } => ({ filter: payload })
);

export const getBuyersSuccess = createAction(
	"[Orders] Get Buyers Success",
	(payload: Partner[]): { buyers: Partner[] } => ({ buyers: payload })
);

export const getBuyersFailed = createAction(
	"[Orders] Get Buyers Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetBuyers = createAction(
	"[Orders] Reset Buyers"
);

export const getSuppliers = createAction(
	"[Orders] Get Suppliers",
	(payload: PartnersParams): { filter: PartnersParams } => ({ filter: payload })
);

export const getSuppliersSuccess = createAction(
	"[Orders] Get Suppliers Success",
	(payload: Partner[]): { suppliers: Partner[] } => ({ suppliers: payload })
);

export const getSuppliersFailed = createAction(
	"[Orders] Get Suppliers Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetSuppliers = createAction(
	"[Orders] Reset Suppliers"
);

export const getDeliveryStorages = createAction(
	"[Orders] Get Delivery Storages",
	(payload: TypedStoragesParams): { filter: TypedStoragesParams } => ({ filter: payload })
);

export const getDeliveryStoragesSuccess = createAction(
	"[Orders] Get Delivery Storages Success",
	(payload: Storage[]): { deliveryStorages: Storage[] } => ({ deliveryStorages: payload })
);

export const getDeliveryStoragesFailed = createAction(
	"[Orders] Get Delivery Storages Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetDeliveryStorages = createAction(
	"[Orders] Reset Delivery Places"
);

export const getOrderDraft = createAction(
	"[Orders] Get Order Draft",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const getOrderDraftSuccess = createAction(
	"[Orders] Get Order Draft Success",
	(payload: any): { order: any } => ({ order: payload })
);

export const getOrderDraftFailed = createAction(
	"[Orders] Get Order Draft Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getOrder = createAction(
	"[Orders] Get Order",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getOrderSuccess = createAction(
	"[Orders] Get Order Success",
	(payload: any): { order: any } => ({ order: payload })
);

export const getOrderFailed = createAction(
	"[Orders] Get Order Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const processOrder = createAction(
	"[Orders] Process Order",
	(payload: { orderId: number; orderCode: OrderKind }): { params: { orderId: number; orderCode: OrderKind } } => ({ params: payload })
);

export const processOrderSuccess = createAction(
	"[Orders] Process Order Success",
	(payload: OrderParams): { order: OrderParams } => ({ order: payload })
);

export const processOrderError = createAction(
	"[Orders] Process Order Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetOrder = createAction(
	"[Orders] Reset Order",
	(): { order: undefined } => ({ order: undefined })
);

export const openEditDraft = createAction(
	"[Orders] Open Edit Draft",
	(payload: EditOrderParams): { editOrderParams: EditOrderParams } => ({ editOrderParams: payload })
);

export const openEditDraftSuccess = createAction("[Orders] Open Edit Draft Success ");

export const openEditDraftError = createAction(
	"[Orders] Open Edit Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const openResponseDraft = createAction(
	"[Orders] Open Response Draft",
	(payload: { responseId: number; documentNameCode?: OrderKind }): { params: { responseId: number; documentNameCode?: OrderKind } } => ({ params: payload })
);

export const openResponseDraftSuccess = createAction("[Orders] Open Response Draft Success ");

export const openResponseDraftError = createAction(
	"[Orders] Open Response Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getOrdersResponseDraft = createAction(
	"[Orders] Get Orders Response Draft",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getOrdersResponseDraftSuccess = createAction(
	"[Orders] Get Orders Response Draft Success",
	(payload: OrderParams): { order: OrderParams } => ({ order: payload })
);

export const getOrdersResponseDraftError = createAction(
	"[Orders] Get Orders Response Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const saveOrdrsp = createAction(
	"[Orders] Save Order Response Draft",
	(payload: OrderParams): { orderResponse: OrderParams } => ({ orderResponse: payload })
);

export const saveOrdrspSuccess = createAction(
	"[Orders] Save Order Response Draft Success",
	(payload: number): { orderResponseId: number } => ({ orderResponseId: payload })
);

export const saveOrdrspError = createAction(
	"[Orders] Save Order Response Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const cancelOrder = createAction(
	"[Orders] Cancel Order",
	(orderId: number, docType: DraftType): { orderId: number; docType: DraftType } => ({ orderId, docType })
);

export const cancelOrderSuccess = createAction(
	"[Orders] Cancel Order Success"
);

export const cancelOrderError = createAction(
	"[Orders] Cancel Order Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const deleteOrder = createAction(
	"[Orders] Delete Order",
	(orderId: number, orderType: DraftType): { orderId: number; orderType: DraftType } => ({ orderId, orderType })
);

export const deleteOrderSuccess = createAction(
	"[Orders] Delete Order Success"
);

export const deleteOrderError = createAction(
	"[Orders] Delete Order Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const createEwaybillFromOrder = createAction(
	"[Orders] Create Ewaybill From Order",
	(payload: DocumentFromAnotherParams): { params: DocumentFromAnotherParams } => ({ params: payload })
);

export const createEwaybillFromOrderSuccess = createAction(
	"[Orders] Create Ewaybill From Order Success",
	(payload: Ewaybill): { newDocument: Ewaybill } => ({ newDocument: payload })
);

export const createEwaybillFromOrderError = createAction(
	"[Orders] Create Ewaybill From Order Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const createDesadvBasedOnOrder = createAction(
	"[Orders] Create Desadv Based On Order",
	(payload: number): { id: number } => ({ id: payload })
);

export const createDesadvBasedOnOrderSuccess = createAction(
	"[Orders] Create Desadv Based On Order Success",
);

export const createDesadvBasedOnOrderError = createAction(
	"[Orders] Create Desadv Based On Order Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
