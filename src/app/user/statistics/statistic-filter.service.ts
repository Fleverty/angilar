import { Injectable } from "@angular/core";
import { UserFilterService } from "../user-core/user-filter.service";
import { StatisticState } from "./statistic.reducer";
import { DeliveryPlaceFilter } from "@helper/abstraction/statistic";
import { FunctionWithParametersType } from "@ngrx/store/src/models";
import { MultiSelectFormValue } from "@shared/multiselect/multiselect.component";

@Injectable()
export class StatisticFilterService extends UserFilterService<StatisticState> {
	public updatePlaceFilter(filter: DeliveryPlaceFilter, resetAction: FunctionWithParametersType<[], { type: string }>, updateFilterAction: FunctionWithParametersType<[any], { type: string }>, multiSelectFormValue: MultiSelectFormValue): void {
		this.store.dispatch(resetAction());
		if (!multiSelectFormValue.address && !multiSelectFormValue.gln && !(multiSelectFormValue.organizations && multiSelectFormValue.organizations.length)) {
			return;
		}

		filter.page = 1;
		filter.relatedPartyId = multiSelectFormValue.organizations ? multiSelectFormValue.organizations.map(el => +el.id) : [];
		filter.storageAddressFull = multiSelectFormValue && multiSelectFormValue.address;
		filter.storageGln = multiSelectFormValue && multiSelectFormValue.gln;

		this.store.dispatch(updateFilterAction({ ...filter }));
	}

	public nextPlacePage(filter: DeliveryPlaceFilter, updateFilterAction: FunctionWithParametersType<[any], { type: string }>): void {
		filter.page++;
		this.store.dispatch(updateFilterAction({ ...filter }));
	}

	public resetPlaces(resetAction: FunctionWithParametersType<[], { type: string }>): void {
		this.store.dispatch(resetAction());
	}
}
