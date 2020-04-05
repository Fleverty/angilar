import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { EinvoiceState } from "../einvoice.reducer";
import { UserSelector } from "@app/user/user-core/user-selector";

@Injectable()
export class EinvoiceSelectorService extends UserSelector<EinvoiceState> {
	constructor(protected readonly store: Store<EinvoiceState>) {
		super(store);
	}

	public selectFn = (appState: any): EinvoiceState => appState.einvoice;
}
