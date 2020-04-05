import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { OrderFormBuilderService } from "./order-form-builder.service";
import { Observable, Subject } from "rxjs";
import { OrdersState } from "../orders.reducer";
import { Store } from "@ngrx/store";
import * as OrderActions from "../order.actions";
import { saveOrderDraft } from "../order.actions";
import { OrderTransformService } from "./order-transform.service";
import { OrderKind } from "@helper/abstraction/order";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { Storage, TypedStoragesParams } from "@helper/abstraction/storages";
import { take, takeUntil, map } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { OrderEditTotalSumComponent } from "@app/user/documents/order/order-edit-total-sum/order-edit-total-sum.component";
import { MessageType, DocumentKind } from "@helper/abstraction/documents";
import { OrdersSelectorService } from "../order-selector.service";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { ValidatorsUtil } from "@helper/validators-util";
import { Actions, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order",
	templateUrl: "./order.component.html",
	styleUrls: ["./order.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnDestroy {
	public get type(): MessageType {
		return this.activatedRoute.snapshot.queryParams.draftType;
	}

	public get id(): string {
		return this.activatedRoute.snapshot.queryParams.draftId;
	}

	public get kind(): OrderKind {
		return this.activatedRoute.snapshot.queryParams.kind;
	}

	public form$: Observable<FormGroup>;
	public suppliers$?: Observable<[Partner, string][]>;
	public deliveryStorages$?: Observable<[Storage, string][]>;
	public sendingStatus$: Observable<"PENDING" | "OK" | "SAVE" | "ERROR">;

	// TODO SIMONOV: NEED LATE FOR OTHER DOCUMENT KIND
	// public buyers$: Observable<[Partner, string][]>;
	// public buyersParams: PartnersParams = {
	// 	page: 1,
	// 	partnerName: "",
	// 	size: 30,
	// 	documentTypeId: "DESADV"
	// };
	public suppliersParams: PartnersParams = {
		page: 1,
		searchText: "",
		size: 30
	};
	public deliveryStoragesParams: TypedStoragesParams = {
		page: 1,
		searchText: "",
		size: 30,
		documentTypeId: "ORDERS",
		storageTypeId: "DELIVERY_PLACE"
	};
	private unsubscribe$$: Subject<void> = new Subject<void>();
	private currentOrganizationId?: number;
	private texts: Map<string, string> = new Map<string, string>();

	constructor(
		private readonly router: Router,
		private readonly orderFormBuilderService: OrderFormBuilderService,
		private readonly overlayService: OverlayService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<OrdersState>,
		private readonly orderTransformService: OrderTransformService,
		private readonly userFilterService: UserFilterService<OrdersState>,
		private readonly ordersSelectorService: OrdersSelectorService,
		private readonly userErrorsService: UserErrorsService,
		private readonly actions$: Actions
	) {
		if (!this.kind)
			this.goBack();
		this.store.dispatch(OrderActions.setOrderKind(this.kind));

		if ((!this.kind || !this.type))
			throw Error("No params!");


		this.sendingStatus$ = this.ordersSelectorService.select$(state => state.status);
		this.form$ = this.orderFormBuilderService.getForm$(this.type, this.id);

		this.form$.pipe(
			notNull(),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(form => {
			this.suppliers$ = this.ordersSelectorService.selectDictionariesFromStore$<Partner>(
				partner => partner.name,
				state => state.suppliers
			);
			this.deliveryStorages$ = this.ordersSelectorService.selectDictionariesFromStore$<Storage>(
				storage => [storage.addressFull, storage.storageName].filter(e => !!e).join(", "),
				state => state.deliveryStorages,
			);

			this.currentOrganizationId = form.getRawValue().buyer.buyerId;
			this.deliveryStoragesFilterChanged("");
			this.supplierFilterChanged("");
		});


		// TODO SIMONOV: NEED LATE FOR OTHER DOCUMENT KIND
		// this.store.dispatch(OrderActions.getBuyers(this.buyersParams));
		// const selectPartners = createSelector(selectOrders, (state: OrdersState): [Partner, string][] => (state.buyers || []).map((buyer: Partner) => ([buyer, buyer.name])));
		// this.buyers$ = this.store.pipe(select(selectPartners));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.store.dispatch(OrderActions.resetOrder());
	}

	@ViewChild("textsTemplate", { static: true })
	public set textsTemplate(value: ElementRef) {
		this.texts = TemplateUtil.getMap(value.nativeElement);
	}

	public deliveryStoragesFilterChanged(search?: string): void {
		this.deliveryStoragesParams.partnerId = this.currentOrganizationId;
		this.userFilterService.updateFilter(this.deliveryStoragesParams, OrderActions.resetDeliveryStorages, OrderActions.getDeliveryStorages, search);
	}

	public supplierFilterChanged(search?: string): void {
		this.userFilterService.updateFilter(this.suppliersParams, OrderActions.resetSuppliers, OrderActions.getSuppliers, search);
	}

	public save(form: FormGroup): void {
		if (!form.getRawValue().product.products.length) {
			this.overlayService.showNotification$(this.texts.get("emptyProducts") || "", "error");
			return;
		}

		const partParams = this.orderTransformService.tryToOrdersParams(form.getRawValue());
		this.store.dispatch(saveOrderDraft(partParams));
	}

	public delete(): void {
		this.store.dispatch(OrderActions.deleteOrder(+this.id, this.type));
	}

	public changeTotalSums(form: FormGroup): void {
		const component = this.overlayService.show(OrderEditTotalSumComponent, { inputs: { form: form.get("product") }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public goBack(): void {
		this.router.navigate(
			["user", "documents", "ORDERS", documentState.draft],
		);
	}

	public sendOrder(form: FormGroup): void {
		if (!form.getRawValue().product.products.length) {
			this.overlayService.showNotification$(this.texts.get("emptyProducts") || "", "error");
			return;
		}

		if (form.invalid) {
			ValidatorsUtil.triggerValidation(form);
			this.userErrorsService.displayErrors(form);
			return form.markAsTouched();
		}

		this.actions$.pipe(
			ofType(OrderActions.saveOrderDraftFailed, OrderActions.sendOrderDraftFailed),
			take(1),
			map(action => action.error),
			takeUntil(this.unsubscribe$$)
		).subscribe(err => {
			let m = "";
			if (err instanceof HttpErrorResponse) {
				m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
			} else {
				m = err.message;
			}
			this.overlayService.showNotification$(m, "error");
		});


		const partParams = this.orderTransformService.tryToOrdersParams(form.getRawValue()) as DocumentKind;
		this.store.dispatch(OrderActions.sendOrderDraftWithValidation(partParams));
	}
}
