import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { StatisticState } from "./statistic.reducer";
import { UserSelector } from "../user-core/user-selector";

@Injectable()
export class StatisticSelectorService extends UserSelector<StatisticState> {
	constructor(protected readonly store: Store<StatisticState>) {
		super(store);
	}

	public selectFn = (appState: any): StatisticState => appState.statistics;
}
