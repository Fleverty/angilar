import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { UserBackendService } from "../user-core/user-backend.service";
import * as StatisticActions from "./statistic.actions";
import { StatisticEwaybillDto, DeliveryPointStatistic, ShipperDto, StatisticOrdersDto } from "@helper/abstraction/statistic";
import { map, exhaustMap, catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { StatisticPropertiesUtil } from "@helper/statistic-properties-util";
import { Status } from "@helper/abstraction/status";

@Injectable()
export class StatisticEffects {
	public updateStatisticFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.updateStatisticFilter),
		map(({ statisticFilterParams }): Action => {
			const { documentType, ...filterParams } = statisticFilterParams;
			return documentType === "EWAYBILL" ? StatisticActions.getEwaybillDocuments(filterParams) : StatisticActions.getOrdersDocuments(filterParams);
		})
	));

	public getEwaybillDocuments$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getEwaybillDocuments),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.findEwaybillByFilter.post$(action.statisticParams).pipe(
			map((value: StatisticEwaybillDto): Action => StatisticActions.getDocumentsSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getDocumentsError(err)))
		))
	));

	public getOrdersDocuments$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getOrdersDocuments),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.findOrdersStatisticByFilter.post$(action.statisticParams).pipe(
			map((value: StatisticOrdersDto): Action => {
				value = value.map(el => ({ ...el, id: el.order.id }));
				return StatisticActions.getOrdersDocumentsSuccess(value);
			}),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getOrdersDocumentsError(err)))
		))
	));

	public getShipper$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getShipper),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.valuesStatistic.post$(action.filter).pipe(
			map((value: ShipperDto): Action => StatisticActions.getShipperSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getShipperError(err)))
		))
	));

	public getParties$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getParties),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.valuesStatistic.post$(action.filter).pipe(
			map((value: ShipperDto): Action => StatisticActions.getPartiesSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getPartiesError(err)))
		))
	));

	public getLoadingPoints$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getLoadingPoints),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.findActiveStorageAndNsiGeneralGlnByCondition.get$(action.statisticFilterParams).pipe(
			map((value: DeliveryPointStatistic[]): Action => StatisticActions.getLoadingPointsSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getLoadingPointsError(err)))
		))
	));

	public getUnloadingPoints$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getUnloadingPoints),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.findActiveStorageAndNsiGeneralGlnByCondition.get$(action.statisticFilterParams).pipe(
			map((value: DeliveryPointStatistic[]): Action => StatisticActions.getUnloadingPointsSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getUnloadingPointsError(err)))
		))
	));

	public getDeliveryPoints$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getDeliveryPoints),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.findActiveStorageAndNsiGeneralGlnByCondition.get$(action.statisticFilterParams).pipe(
			map((value: DeliveryPointStatistic[]): Action => StatisticActions.getDeliveryPointsSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getDeliveryPointsError(err)))
		))
	));

	public getReceiver$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.getReceiver),
		exhaustMap((action): Observable<Action> => this.backendService.statistic.valuesStatistic.post$(action.filter).pipe(
			map((value: ShipperDto): Action => StatisticActions.getReceiverSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getReceiverError(err)))
		))
	));

	public updateStatusesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.updateStatusesFilter),
		exhaustMap((action): Observable<Action> => this.backendService.documents.processingStatuses.list.get$(action.documentTypeId).pipe(
			map((value: Status[]): Action => StatisticActions.getStatusesSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(StatisticActions.getStatusesError(err)))
		))
	));

	public switchStatisticProperties$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(StatisticActions.switchStatisticProperties),
		map(({ documentTypeId }): Action => StatisticActions.setStatisticProperties(this.statisticProperties.getProperties(documentTypeId)))
	));

	private readonly statisticProperties = StatisticPropertiesUtil;
	constructor(
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
	) { }
}
