import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { skip, take } from "rxjs/operators";
import { OrdersSelectorService } from "@app/user/documents/order/order-selector.service";
import { OrderParams } from "@helper/abstraction/order";
import { getOrder } from "@app/user/documents/order/order.actions";
import { OrdersState } from "@app/user/documents/order/orders.reducer";

@Injectable()
export class OrderResolverService implements Resolve<OrderParams | undefined> {
	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly orderSelectorService: OrdersSelectorService,
		private readonly store: Store<OrdersState>,
	) {
	}

	public resolve(route: ActivatedRouteSnapshot): Observable<OrderParams | undefined> {
		const type = route.paramMap.get("type");
		const id = route.paramMap.get("id");
		const trueMessagesType = this.userPermissionService.getDraftTypes("ORDERS");
		const docType = trueMessagesType.find(t => t === type) || null;
		const docId = id && Number.isFinite(+id) ? +id : null;

		if (!docType || !docId)
			return of(undefined);

		let action = getOrder(docType, docId);
		if (route.data.action && typeof route.data.action === "function")
			action = route.data.action(docType, docId);

		this.store.dispatch(action);
		return this.orderSelectorService.select$(state => state.order).pipe(skip(1), take(1));
	}
}
