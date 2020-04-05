import { OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { OrdersState } from "../orders.reducer";
import * as OrderActions from "../order.actions";
import { OrderView } from "./order-view";
import { OrderViewService } from "../order-view.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { documentState } from "@helper/paths";

export abstract class OrderBuyer extends OrderView implements OnDestroy, OnInit {
	public documentStatePath = documentState;
	public isBuyer$?: Observable<boolean>;

	constructor(
		protected readonly activatedRoute: ActivatedRoute,
		protected readonly store: Store<OrdersState>,
		protected readonly router: Router,
		protected readonly orderViewService: OrderViewService
	) {
		super(activatedRoute, store);
	}

	public ngOnInit(): void {
		if (this.order)
			this.isBuyer$ = this.orderViewService.isSeller$(this.order.supplierGln).pipe(
				map(isSeller => !isSeller)
			);
	}

	public cancel(): void {
		this.store.dispatch(OrderActions.cancelOrder(+this.id, this.type));
	}

	public ngOnDestroy(): void {
		this.store.dispatch(OrderActions.resetOrder());
	}

	public abstract prevPage(): void;
}
