import * as StatisticActions from "./statistic.actions";
import { createReducer, Action, on } from "@ngrx/store";
import { StatisticEwaybillDocument, Shipper, StatisticFilterParams, DeliveryPointStatistic, StatisticOrdersDocument } from "@helper/abstraction/statistic";
import { DocumentProperty } from "@helper/abstraction/documents";
import { Status } from "@helper/abstraction/status";

export interface StatisticState {
	currentStatisticProperties: DocumentProperty[];
	statisticFilterParams?: StatisticFilterParams;
	documents?: StatisticEwaybillDocument[] | StatisticOrdersDocument[];
	selectedItems: StatisticEwaybillDocument[];
	shipper?: Shipper[];
	receiver?: Shipper[];
	party?: Shipper[];
	statuses?: Status[];
	loadingPoints?: DeliveryPointStatistic[];
	unloadingPoints?: DeliveryPointStatistic[];
	deliveryPoints?: DeliveryPointStatistic[];
}

export const initialState: StatisticState = {
	documents: [],
	selectedItems: [],
	currentStatisticProperties: [],
};

const statisticReducer = createReducer(
	initialState,
	on(StatisticActions.updateStatisticFilter, (state, { statisticFilterParams }): StatisticState => ({ ...state, statisticFilterParams })),
	on(StatisticActions.getDocumentsSuccess, (state, { documents }): StatisticState => ({ ...state, documents })),
	on(StatisticActions.getOrdersDocumentsSuccess, (state, { documents }): StatisticState => ({ ...state, documents })),
	on(StatisticActions.resetDocuments, (state, { documents }): StatisticState => ({ ...state, documents })),
	on(StatisticActions.pushSelectedItems, (state, { selectedItems }): StatisticState => ({ ...state, selectedItems })),
	on(StatisticActions.resetSelectedItems, (state, { selectedItems }): StatisticState => ({ ...state, selectedItems })),
	on(StatisticActions.getShipperSuccess, (state, { shipper }): StatisticState => ({ ...state, shipper })),
	on(StatisticActions.resetShipper, (state, { shipper }): StatisticState => ({ ...state, shipper })),
	on(StatisticActions.getReceiverSuccess, (state, { receiver }): StatisticState => ({ ...state, receiver })),
	on(StatisticActions.resetReceiver, (state, { receiver }): StatisticState => ({ ...state, receiver })),
	on(StatisticActions.getPartiesSuccess, (state, { party }): StatisticState => ({ ...state, party })),
	on(StatisticActions.resetParties, (state, { party }): StatisticState => ({ ...state, party })),
	on(StatisticActions.getStatusesSuccess, (state, { statuses }): StatisticState => ({ ...state, statuses })),
	on(StatisticActions.resetStatuses, (state, { statuses }): StatisticState => ({ ...state, statuses })),
	on(StatisticActions.setStatisticProperties, (state, { currentStatisticProperties }): StatisticState => ({ ...state, currentStatisticProperties })),
	on(StatisticActions.getLoadingPointsSuccess, (state, { loadingPoints }): StatisticState => ({ ...state, loadingPoints })),
	on(StatisticActions.resetLoadingPoints, (state, { loadingPoints }): StatisticState => ({ ...state, loadingPoints })),
	on(StatisticActions.getUnloadingPointsSuccess, (state, { unloadingPoints }): StatisticState => ({ ...state, unloadingPoints })),
	on(StatisticActions.resetUnloadingPoints, (state, { unloadingPoints }): StatisticState => ({ ...state, unloadingPoints })),
	on(StatisticActions.getDeliveryPointsSuccess, (state, { deliveryPoints }): StatisticState => ({ ...state, deliveryPoints })),
	on(StatisticActions.resetDeliveryPoints, (state, { deliveryPoints }): StatisticState => ({ ...state, deliveryPoints })),
);

export function reducer(state: StatisticState | undefined, action: Action): StatisticState {
	return statisticReducer(state, action);
}
