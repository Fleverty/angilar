import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { CustomizationState } from "./customization.reducer";
import { getActiveHelpContent } from "./customization.actions";

@Injectable()
export class CustomizationResolver implements Resolve<void> {
	constructor(
		private readonly store: Store<CustomizationState>,
	) { }

	public resolve(route: ActivatedRouteSnapshot): void {
		this.store.dispatch(getActiveHelpContent(+route.params.id));
	}
}
