import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import * as ShipmentNotifications from "./shipment-notification.actions";
import { catchError, debounceTime, exhaustMap, map, startWith, switchMap, take } from "rxjs/operators";
import { Partner } from "@helper/abstraction/partners";
import { Action, createSelector, Store } from "@ngrx/store";
import { Storage } from "@helper/abstraction/storages";
import { ShipmentNotificationsState } from "@app/user/documents/shipment-notification/shipment-notification.reducer";
import { ShipmentNotification } from "@app/user/documents/shipment-notification/shipment-notification";
import * as DocumentsActions from "@app/user/documents/documents.actions";

import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { sendDraft } from "@app/user/documents/documents.actions";
import { exportXMLDocumentsError } from "@app/user/user.actions";
import { documentState } from "@helper/paths";

@Injectable()
export class ShipmentNotificationEffects {
	public readonly selectProducts = createSelector((appState: any): ShipmentNotificationsState => appState.shipmentNotifications, (state: ShipmentNotificationsState) => state.products);
	public readonly selectTotalSums = createSelector((appState: any): ShipmentNotificationsState => appState.shipmentNotifications, (state: ShipmentNotificationsState) => state.totalSums);
	public readonly selectIsAutoSum = createSelector((appState: any): ShipmentNotificationsState => appState.shipmentNotifications, (state: ShipmentNotificationsState) => state.isAutoSum);

	public getShipmentNotificationsDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.getShipmentNotificationDraft),
		exhaustMap((action): Observable<Action> => this.backendService.draft.find.get$<ShipmentNotification>(action.draftType, action.draftId).pipe(
			map((shipmentNotification: ShipmentNotification): Action => ShipmentNotifications.getShipmentNotificationDraftSuccess(shipmentNotification)),
			catchError((error: Error): Observable<Action> => of(ShipmentNotifications.getShipmentNotificationDraftError(error)))
		))
	));

	public getBuyers$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.getBuyers),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.organization.buyers.list.get$(action.filter).pipe(
			map((partners: Partner[]): Action => ShipmentNotifications.getBuyersSuccess(partners)),
			catchError((error: Error): Observable<Action> => of(ShipmentNotifications.getBuyersFailed(error)))
		))
	));

	public getShipmentPlaces$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.getShipmentPlaces),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.organization.storages.list.getByStorageType$(action.filter).pipe(
			map((shipmentPlaces: Storage[]): Action => ShipmentNotifications.getShipmentPlacesSuccess(shipmentPlaces)),
			catchError((error: Error): Observable<Action> => of(ShipmentNotifications.getShipmentPlacesFailed(error)))
		))
	));

	public updateUnitOfMeasuresFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.updateUnitOfMeasuresFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.uom.list.get$(action.filter, "DESADV").pipe(
			map((unitOfMeasures): Action => ShipmentNotifications.getUnitOfMeasuresSuccess(unitOfMeasures)),
			catchError((error): Observable<Action> => of(ShipmentNotifications.getUnitOfMeasuresError(error)))
		))
	));

	public updateCountriesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.updateCountriesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.countries.list.get$(action.filter).pipe(
			map((countries): Action => ShipmentNotifications.getCountriesSuccess(countries)),
			catchError((error): Observable<Action> => of(ShipmentNotifications.getCountriesError(error)))
		))
	));

	public getDeliveryStorages$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.getDeliveryStorages),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.organization.storages.list.getByStorageType$(action.filter).pipe(
			map((storages): Action => ShipmentNotifications.getDeliveryStoragesSuccess(storages)),
			catchError((error) => of(ShipmentNotifications.getDeliveryStoragesFailed(error)))
		))
	));

	public saveShipmentNotification = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.saveShipmentNotification),
		exhaustMap((action): Observable<Action> => {
			const shipmentNotification = new ShipmentNotification(action.shipmentNotification);
			return this.backendService.draft.saveDESADV.post$(shipmentNotification).pipe(
				map((id: number): Action => ShipmentNotifications.saveShipmentNotificationSuccess(id)),
				catchError((error: Error): Observable<Action> => of(ShipmentNotifications.saveShipmentNotificationFailed(error)))
			);
		})
	));

	public saveDocumentSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.saveShipmentNotificationSuccess),
		map((action) => {
			this.router.navigate(
				["user", "documents", "DESADV", documentState.draft],
			);
			return ShipmentNotifications.setCreatedShipmentNotificationId(action.id);
		})
	));

	public deleteShipmentNotification = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.deleteShipmentNotificationDraft),
		exhaustMap((action): Observable<Action> => this.backendService.draft.delete("DESADV", action.idsToDelete).pipe(
			map((deletedCount): Action => ShipmentNotifications.deleteShipmentNotificationDraftSuccess(deletedCount)),
			catchError((error): Observable<Action> => of(ShipmentNotifications.deleteShipmentNotificationDraftFailed(error)))
		))
	));

	public deleteShipmentNotificationSuccess = createEffect((): Observable<any> => this.actions$.pipe(
		ofType(ShipmentNotifications.deleteShipmentNotificationDraftSuccess),
		map((): void => {
			this.router.navigate(
				["user", "documents", "DESADV", documentState.draft]
			);
		})
	), { dispatch: false });

	public getShipmentNotificationDocument$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.getShipmentNotificationDocument),
		exhaustMap((action): Observable<Action> =>
			this.backendService.desadv.get$(action.draftId).pipe(
				map((value: ShipmentNotification) => ShipmentNotifications.getShipmentNotificationDocumentSuccess(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(ShipmentNotifications.getShipmentNotificationDocumentError(err)))
			)
		)
	));

	public exportShipmentNotificationXMLError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(exportXMLDocumentsError),
		map(action => ShipmentNotifications.exportShipmentNotificationXMLError(action.error))
	));

	public sendShipmentNotificationDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ShipmentNotifications.sendShipmentNotificationDraft),
		switchMap((action) =>
			this.actions$.pipe(
				ofType(ShipmentNotifications.saveShipmentNotificationSuccess),
				take(1),
				map(action2 => sendDraft({ draftId: `${action2.id}`, draftType: "DESADV" })),
				startWith(ShipmentNotifications.saveShipmentNotification(action.shipmentNotification))
			)
		)
	));

	public getShipmentNotificationDraftNumberSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.getDraftNumberSuccess),
		map(action => ShipmentNotifications.getShipmentNotificationDraftNumberSuccess(action.documentDraftNumber))
	));

	constructor(
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
		private readonly store: Store<ShipmentNotificationsState>,
		private readonly router: Router
	) {
	}
}
