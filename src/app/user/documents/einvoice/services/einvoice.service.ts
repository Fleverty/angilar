import { Injectable } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";

import { FunctionWithParametersType } from "@ngrx/store/src/models";
import { Store } from "@ngrx/store";
import { EinvoiceState } from "../einvoice.reducer";
import { FilterRequestParams } from "@helper/abstraction/filter";

@Injectable()
export class EinvoiceService {
	constructor(
		private readonly store$: Store<EinvoiceState>
	) { }

	public removeIfGroupIsNull<T>(formArray: FormArray): number | undefined {
		const lastIndex: number = formArray.length - 1;
		let isNull = false;
		if (formArray.length) {
			const value: T = (formArray.at(lastIndex) as FormGroup).getRawValue();
			isNull = this.isEveryObjectPropertiesNull(value);
			if (isNull) {
				formArray.removeAt(lastIndex);
			}
		}
		return isNull ? lastIndex : undefined;
	}

	public isEveryObjectPropertiesNull(obj: { [key: string]: any }): boolean {
		for (const props in obj) {
			if (obj[props]) {
				return false;
			}
		}
		return true;
	}

	public updateFilter(filter: FilterRequestParams, resetAction: FunctionWithParametersType<[], { type: string }>, updateFilterAction: FunctionWithParametersType<[any], { type: string }>, searchText?: string): void {
		if (searchText === undefined) {
			filter.page += 1;
			filter.searchText = undefined;
		} else {
			filter.page = 1;
			filter.searchText = searchText;
			this.store$.dispatch(resetAction());
		}
		this.store$.dispatch(updateFilterAction({ ...filter }));
	}
}
