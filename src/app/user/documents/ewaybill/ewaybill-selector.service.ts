import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { EwaybillState } from "./ewaybill.reducer";
import { UserSelector } from "../../user-core/user-selector";

@Injectable()
export class EwaybillSelectorService extends UserSelector<EwaybillState> {
	constructor(protected readonly store: Store<EwaybillState>) {
		super(store);
	}

	public selectFn = (appState: any): EwaybillState => appState.ewaybill;
}
