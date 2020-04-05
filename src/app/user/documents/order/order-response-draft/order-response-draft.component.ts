import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OrdersState } from "@app/user/documents/order/orders.reducer";
import { OrderFormBuilderService } from "@app/user/documents/order/order/order-form-builder.service";
import { FormGroup } from "@angular/forms";
import { OrderEditTotalSumComponent } from "@app/user/documents/order/order-edit-total-sum/order-edit-total-sum.component";
import { takeUntil, take, catchError, exhaustMap } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { OrderTransformService } from "@app/user/documents/order/order/order-transform.service";
import { DraftType } from "@helper/abstraction/draft";

import * as OrderActions from "../order.actions";
import { Observable, Subject } from "rxjs";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { OrderProductParams, OrderResponseParams, OrderParams } from "@helper/abstraction/order";
import { OrdersSelectorService } from "../order-selector.service";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Actions, ofType } from "@ngrx/effects";
import { documentState } from "@helper/paths";
import { DocumentKind } from "@helper/abstraction/documents";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-order-response-draft",
	templateUrl: "./order-response-draft.component.html",
	styleUrls: ["./order-response-draft.component.scss"]
})
export class OrderResponseDraftComponent implements OnDestroy {
	public get type(): DraftType {
		return this.activatedRoute.snapshot.params["type"];
	}

	public get id(): number {
		return this.activatedRoute.snapshot.params["id"];
	}

	public form$: Observable<FormGroup>;
	public orderResponse$: Observable<OrderResponseParams | undefined>;
	public currentProducts$: Observable<OrderProductParams[]>;
	public status$: Observable<"PENDING" | "OK" | "SAVE" | "ERROR">;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<OrdersState>,
		private readonly orderFormBuilderService: OrderFormBuilderService,
		private readonly orderTransformService: OrderTransformService,
		private readonly overlayService: OverlayService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly userErrorsService: UserErrorsService,
		private readonly ordersSelectorService: OrdersSelectorService,
		private readonly userBackendService: UserBackendService,
		private readonly actions$: Actions
	) {
		this.status$ = this.ordersSelectorService.select$(state => state.status);
		this.form$ = this.orderFormBuilderService.getResponseForm$(this.type, this.id);
		this.orderResponse$ = this.ordersSelectorService.select$(state => state.order);
		this.currentProducts$ = this.ordersSelectorService.select$(state => state.order && state.order.msgOrdrspItems || []);
	}

	public accept(form: FormGroup, document: OrderResponseParams): void {
		if (!form.valid) {
			form.markAsTouched();
			this.userErrorsService.displayErrors(form);
			return;
		}

		const formValue = this.orderTransformService.tryToOrdrspParams(form.getRawValue());

		this.store.dispatch(OrderActions.sendOrderResponseDraftWithValidation({
			...document,
			...formValue
		} as DocumentKind));
	}

	public save(form: FormGroup, document: OrderResponseParams): void {
		if (!form.valid) {
			form.markAsTouched();
			this.userErrorsService.displayErrors(form);
			return;
		}

		const formValue = this.orderTransformService.tryToOrdrspParams(form.getRawValue());

		this.store.dispatch(OrderActions.saveOrderResponseDraft({
			...document,
			...formValue
		}));
	}

	public delete(): void {
		this.store.dispatch(OrderActions.deleteOrder(this.id, this.type));
	}

	public prevPage(): void {
		this.router.navigate(["user", "documents", "ORDERS", documentState.draft]);
	}

	public changeTotalSums(form: FormGroup): void {
		const component = this.overlayService.show(OrderEditTotalSumComponent, { inputs: { form: form.get("product") }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			this.overlayService.clear();
			this.changeDetectorRef.detectChanges();
		});
	}

	public cancel(document: OrderParams): void {
		// Костыль для бека todo: убрать
		// На данный момент по каким-то причинам не работает document.cancel
		this.userBackendService.draft.saveORDRSP.post$({
			...document as Partial<OrderParams>,
			functionCode: "27" // код отмены походу
		}).pipe(
			exhaustMap(() => {
				this.store.dispatch(OrderActions.sendOrderDraft({ draftId: `${document.id}`, draftType: "ORDRSP" }));
				return this.actions$.pipe(
					ofType(OrderActions.sendOrderDraftSuccess),
					catchError(error => this.overlayService.showNotification$("error", error)),
					take(1)
				);
			}),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.prevPage());
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.store.dispatch(OrderActions.resetOrder());
	}
}
