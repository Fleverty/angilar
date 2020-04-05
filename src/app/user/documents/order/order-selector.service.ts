import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { OrdersState } from "./orders.reducer";
import { UserSelector } from "@app/user/user-core/user-selector";

@Injectable()
export class OrdersSelectorService extends UserSelector<OrdersState> {
	constructor(protected readonly store: Store<OrdersState>) {
		super(store);
	}

	protected selectFn = (appState: any): OrdersState => appState.orders;
}
