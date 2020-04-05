import { OnDestroy } from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersState } from "../orders.reducer";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { Subscription } from "rxjs";
import * as OrderActions from "../order.actions";
import { EwaybillSharedCreatePopupComponent } from "../../ewaybill-create-popup/ewaybill-shared-create-popup.component";
import { OrderView } from "./order-view";
import { ofType, Actions } from "@ngrx/effects";
import { take } from "rxjs/operators";
import { documentState } from "@helper/paths";

export abstract class OrderSupplier extends OrderView implements OnDestroy {
	public documentStatePath = documentState;
	private ewaybillPopup?: Subscription;

	constructor(
		protected readonly activatedRoute: ActivatedRoute,
		protected readonly store: Store<OrdersState>,
		protected readonly router: Router,
		protected readonly overlayService: OverlayService,
		protected readonly actions: Actions,
	) {
		super(activatedRoute, store);
	}

	public process(): void {
		this.store.dispatch(OrderActions.processOrder({ orderId: +this.id, orderCode: this.code }));
	}

	public createEwaybill(): void {
		const inputs = {
			route: this.activatedRoute,
			onCreateFn: (params: { draftType: DraftType; isTest: boolean }): void => {
				this.store.dispatch(OrderActions.createEwaybillFromOrder({
					sourceDocumentType: "ORDERS",
					destinationDocumentType: params.draftType,
					id: +this.id,
					testIndicator: params.isTest
				}));
				this.overlayService.clear();
				this.actions.pipe(ofType(OrderActions.createEwaybillFromOrderSuccess), take(1)).subscribe(ewaybill => {
					this.router.navigateByUrl(
						this.router.createUrlTree(["/user/documents/EWAYBILL/edit"], {
							queryParams: {
								draftId: ewaybill.newDocument.id,
								draftType: params.draftType
							}
						})
					);
				});
			}
		};

		const component = this.overlayService.show(EwaybillSharedCreatePopupComponent, { inputs, centerPosition: true });
		component.instance.close$.subscribe(() => {
			this.overlayService.clear();
		});
	}

	public createDesadv(): void {
		this.store.dispatch(OrderActions.createDesadvBasedOnOrder(+this.id));
	}

	public ngOnDestroy(): void {
		if (this.ewaybillPopup)
			this.ewaybillPopup.unsubscribe();
		this.store.dispatch(OrderActions.resetOrder());
	}

	public abstract prevPage(): void;
}
