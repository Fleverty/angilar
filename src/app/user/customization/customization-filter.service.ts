import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CustomizationState } from "./customization.reducer";
import { FilterRequestParams } from "@helper/abstraction/filter";
import { FunctionWithParametersType } from "@ngrx/store/src/models";

@Injectable()
export class CustomizationFilterService {
	constructor(
		private readonly store: Store<CustomizationState>
	) { }

	public updateFilter(filter: FilterRequestParams, resetAction: FunctionWithParametersType<[], { type: string }>, updateFilterAction: FunctionWithParametersType<[any], { type: string }>, searchText?: string): void {
		if (searchText === undefined) {
			filter.page++;
			filter.searchText = undefined;
		} else {
			filter.page = 1;
			filter.searchText = searchText;
			this.store.dispatch(resetAction());
		}
		this.store.dispatch(updateFilterAction({ ...filter }));
	}
}
