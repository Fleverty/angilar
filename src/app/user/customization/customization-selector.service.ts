import { Injectable } from "@angular/core";
import { CustomizationState } from "./customization.reducer";
import { Store } from "@ngrx/store";
import { UserSelector } from "../user-core/user-selector";

@Injectable()
export class CustomizationSelectorService extends UserSelector<CustomizationState> {
	constructor(protected readonly store: Store<CustomizationState>) {
		super(store);
	}

	public selectFn = (appState: any): CustomizationState => appState.customization;
}
