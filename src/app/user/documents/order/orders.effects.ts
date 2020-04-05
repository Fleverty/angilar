import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Observable, of, from } from "rxjs";
import { exhaustMap, map, catchError, switchMap, tap, debounceTime } from "rxjs/operators";
import * as OrdersActions from "./order.actions";
import { Action } from "@ngrx/store";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Partner } from "@helper/abstraction/partners";
import { Router } from "@angular/router";
import { OrderParams } from "@helper/abstraction/order";
import { OverlayService } from "@core/overlay.service";
import { ShipmentNotification } from "@helper/abstraction/shipment-notification";
import { ResponseDraftInfo } from "@helper/abstraction/ewaybill";
import { documentState } from "@helper/paths";

@Injectable()
export class OrdersEffects {
	public updateCurrenciesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.updateCurrenciesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.userBackendService.nsi.currencies.list.get$(action.currenciesFilter).pipe(
			map((currencies): Action => OrdersActions.getCurrenciesSuccess(currencies)),
			catchError((error): Observable<Action> => of(OrdersActions.getCurrenciesError(error)))
		))
	));

	public updateUnitOfMeasuresFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.updateUnitOfMeasuresFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.userBackendService.nsi.uom.list.get$(action.filter, "ORDERS").pipe(
			map((unitOfMeasures): Action => OrdersActions.getUnitOfMeasuresSuccess(unitOfMeasures)),
			catchError((error): Observable<Action> => of(OrdersActions.getUnitOfMeasuresError(error)))
		))
	));

	public getBuyers$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getBuyers),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.userBackendService.organization.buyers.list.get$(action.filter).pipe(
			map((partners: Partner[]): Action => OrdersActions.getBuyersSuccess(partners)),
			catchError((error: Error): Observable<Action> => of(OrdersActions.getBuyersFailed(error)))
		))
	));

	public getSuppliers$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getSuppliers),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.userBackendService.organization.partners.list.get$(action.filter).pipe(
			map((partners: Partner[]): Action => OrdersActions.getSuppliersSuccess(partners)),
			catchError((error: Error): Observable<Action> => of(OrdersActions.getSuppliersFailed(error)))
		))
	));

	public getDeliveryStorages$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getDeliveryStorages),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.userBackendService.organization.storages.list.getByStorageType$(action.filter).pipe(
			map((storages): Action => OrdersActions.getDeliveryStoragesSuccess(storages)),
			catchError((error) => of(OrdersActions.getDeliveryStoragesFailed(error)))
		))
	));

	public getOrder$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getOrderDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.find.get$(action.draftType, action.draftId).pipe(
			map((order): Action => OrdersActions.getOrderDraftSuccess(order)),
			catchError((error) => of(OrdersActions.getOrderDraftFailed(error)))
		))
	));

	public getOrderById$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.order.get$(action.draftId).pipe(
			map((order): Action => OrdersActions.getOrderSuccess(order)),
			catchError((error) => of(OrdersActions.getOrderFailed(error)))
		))
	));

	public saveDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.saveOrderDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.saveORDERS.post$(action.orderParams).pipe(
			map((id): Action => OrdersActions.saveOrderDraftSuccess(id)),
			catchError(error => of(OrdersActions.saveOrderDraftFailed(error)))
		))
	));

	public saveResponseDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.saveOrderResponseDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.saveORDRSP.post$(action.orderParams).pipe(
			map((id): Action => OrdersActions.saveOrderResponseDraftSuccess(id)),
			catchError(error => of(OrdersActions.saveOrderResponseDraftFailed(error)))
		))
	));

	public getOrderResponseDraft = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.getOrdersResponseDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.response.find$<OrderParams>(action.draftType, action.draftId).pipe(
			map((orderResponse): Action => OrdersActions.getOrdersResponseDraftSuccess(orderResponse)),
			catchError((error: Error) => of(OrdersActions.getOrdersResponseDraftError(error)))
		))
	));

	public processOrder$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.processOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.draftResponse.saveBasedOnOrderORDRSP.post$(action.params.orderId).pipe(
			map((order: ResponseDraftInfo): Action => OrdersActions.openResponseDraft({ responseId: order.id, documentNameCode: action.params.orderCode })),
			catchError((error) => of(OrdersActions.processOrderError(error)))
		))
	));

	public openResponseDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.openResponseDraft),
		exhaustMap(action =>
			from(
				this.router.navigate(["user", "documents", "ORDERS", documentState.draft, "response", "ORDRSP", action.params.documentNameCode, action.params.responseId])
			).pipe(
				map(() => OrdersActions.openResponseDraftSuccess()),
				catchError(error => of(OrdersActions.openResponseDraftError(error)))
			)
		),
	));

	public cancelOrder$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.cancelOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.order.cancel.get$(action.orderId.toString()).pipe(
			map((): Action => OrdersActions.cancelOrderSuccess()),
			catchError((error: Error) => of(OrdersActions.cancelOrderError(error)))
		))
	));

	public deleteOrder$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.deleteOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.delete(action.orderType, [action.orderId]).pipe(
			map((): Action => OrdersActions.deleteOrderSuccess()),
			catchError((error: Error) => of(OrdersActions.deleteOrderError(error)))
		))
	));

	public openEditDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.openEditDraft),
		switchMap(action =>
			from(
				this.router.navigate(["user", "documents", "ORDERS", "edit"], {
					queryParams: {
						draftId: action.editOrderParams.draftId,
						draftType: action.editOrderParams.draftType,
						kind: action.editOrderParams.kind,
					}
				})
			).pipe(
				map(() => OrdersActions.openEditDraftSuccess())
			)
		),
		catchError(error => of(OrdersActions.openEditDraftError(error)))
	));

	public sendOrderDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.sendOrderDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.activemq.send.get$(action.orderParams.draftId, action.orderParams.draftType).pipe(
			map((): Action => OrdersActions.sendOrderDraftSuccess()),
			catchError((err: Error): Observable<Action> => of(OrdersActions.sendOrderDraftFailed(err)))
		))
	));

	public sendOrderDraftWithValidation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.sendOrderDraftWithValidation),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.createWithValidation.post$("ORDERS", action.orderParams).pipe(
			map((draftDto): Action => OrdersActions.sendOrderDraft({ draftId: draftDto.id.toString(), draftType: "ORDERS" })),
			catchError((error: Error): Observable<Action> => of(OrdersActions.creatingWithValidationError(error)))
		))
	));

	public sendOrderResponseDraftWithValidation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(OrdersActions.sendOrderResponseDraftWithValidation),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.createWithValidation.post$("ORDRSP", action.orderParams).pipe(
			map((draftDto): Action => OrdersActions.sendOrderDraft({ draftId: draftDto.id.toString(), draftType: "ORDRSP" })),
			catchError((err: Error): Observable<Action> => of(OrdersActions.creatingWithValidationError(err)))
		))
	));

	public createDesadvBasedOnOrder$ = createEffect(() => this.actions$.pipe(
		ofType(OrdersActions.createDesadvBasedOnOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.order.convertToDraft.DESADV.post$(action.id).pipe(
			switchMap((value: ShipmentNotification) =>
				from(
					this.router.navigate(["user", "documents", "DESADV", "edit", value.id])
				).pipe(
					map(() => OrdersActions.createDesadvBasedOnOrderSuccess())
				)
			),
			catchError((err: Error) => of(OrdersActions.createDesadvBasedOnOrderError(err)))
		))
	), { dispatch: false });

	public navigateToDraft$ = createEffect(() => this.actions$.pipe(
		ofType(OrdersActions.saveOrderDraftSuccess, OrdersActions.deleteOrderSuccess, OrdersActions.saveOrderResponseDraftSuccess),
		tap(() => this.navigateToDraft())
	), { dispatch: false });

	public navigateToOutgoing$ = createEffect(() => this.actions$.pipe(
		ofType(OrdersActions.sendOrderDraftSuccess, OrdersActions.cancelOrderSuccess),
		tap(() => this.navigateToOutgoing())
	), { dispatch: false });

	public createEwaybillFromOrder$ = createEffect(() => this.actions$.pipe(
		ofType(OrdersActions.createEwaybillFromOrder),
		exhaustMap((action): Observable<Action> => this.userBackendService.order.convertToDraft.EWAYBILL.post$(action.params.id, action.params).pipe(
			map((ewaybill) => OrdersActions.createEwaybillFromOrderSuccess(ewaybill)),
			catchError((err: Error) => of(OrdersActions.createDesadvBasedOnOrderError(err)))
		))
	));

	constructor(
		private readonly overlayService: OverlayService,
		private readonly router: Router,
		private readonly actions$: Actions,
		private readonly userBackendService: UserBackendService
	) { }

	public navigateToOutgoing(): void {
		this.router.navigate(["user", "documents", "ORDERS", documentState.outgoing]);
	}

	public navigateToDraft(): void {
		this.router.navigate(["user", "documents", "ORDERS", documentState.draft]);
	}
}
