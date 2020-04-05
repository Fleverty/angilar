import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action, Store, createSelector, select } from "@ngrx/store";
import { exhaustMap, map, catchError, withLatestFrom, switchMap } from "rxjs/operators";
import * as CustomizationActions from "./customization.actions";
import * as UserActions from "./../user.actions";
import { UserBackendService } from "../user-core/user-backend.service";
import { CustomizationState } from "./customization.reducer";
import { Organization } from "@helper/abstraction/organization";
import { UserProfile } from "@helper/abstraction/user";
import { notNull } from "@helper/operators";
import { CustomizationErrorService } from "./customization.service";

@Injectable()
export class CustomizationEffects {
	public getHelpLists$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.getHelpLists),
		exhaustMap((): Observable<Action> => this.backendService.sections.help.data.get$().pipe(
			map((sectionList): Action => CustomizationActions.getHelpListsSuccess(sectionList)),
			catchError((error): Observable<Action> => of(CustomizationActions.getHelpListsError(error)))
		))
	));

	public gethelpPageContent$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.getActiveHelpContent),
		exhaustMap((action): Observable<Action> => this.backendService.sections.help.page.content.get$(action.id).pipe(
			map((content): Action => CustomizationActions.getActiveHelpContentSuccess({
				id: action.id.toString(),
				value: content
			})),
			catchError((error): Observable<Action> => (error.status === 404 ?
				of(CustomizationActions.getActiveHelpContentSuccess({ id: action.id.toString(), value: null })) : of(CustomizationActions.getActiveHelpContentError(error))))
		))
	));

	public getStorages$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.getStorages),
		exhaustMap((action): Observable<Action> => this.backendService.organization.storages.list.get$(action.storagesParams).pipe(
			map((storagesList): Action => storagesList.length > 0 ? CustomizationActions.getStoragesSuccess(storagesList) : CustomizationActions.setStoragesLoaded(true)),
			catchError((error): Observable<Action> => of(CustomizationActions.getStoragesError(error)))
		))
	));

	public deleteStorages$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.deleteStorages),
		exhaustMap((action): Observable<Action> => this.backendService.storages.list.delete$(action.storages.map(e => e.id)).pipe(
			map((deleteIds: string[]): Action => !deleteIds.length ? CustomizationActions.deleteStorageSuccess(action.storages.map(e => e.id)) : CustomizationActions.needConfirmationGLN(deleteIds)),
			catchError((error): Observable<Action> => of(CustomizationActions.deleteStorageFailed(error)))
		))
	));

	public confirmDeletingStorages$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.confirmDeletingStorages),
		exhaustMap((action): Observable<Action> => this.backendService.storages.list.confirmDeleting$(action.storages.map(e => e.id)).pipe(
			map((): Action => CustomizationActions.deleteStorageSuccess(action.storages.map(e => e.id))),
			catchError((error): Observable<Action> => of(CustomizationActions.deleteStorageFailed(error)))
		))
	));

	public changePassword$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.changePassword),
		exhaustMap((action): Observable<Action> => this.backendService.user.changePassword.put$(action.form).pipe(
			map((): Action => CustomizationActions.changePasswordSuccess()),
			catchError((error): Observable<Action> => error.status === 400 ?
				of(CustomizationActions.passwordError(this.customizationErrorService.mapErrorMessage(error.error))) : of(CustomizationActions.changePasswordError(error)))
		))
	));

	public saveOrganization$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.saveOrganization),
		withLatestFrom(this.store$.pipe(select(createSelector((appState: any): CustomizationState => appState.customization, (state: CustomizationState): Organization | undefined => state.organizationInfo)))),
		exhaustMap(([, organizationInfo]): Observable<Action> =>
			this.backendService.organization.post$(organizationInfo as Organization).pipe(
				switchMap((): Observable<Action> => of(
					CustomizationActions.saveOrganizationSuccess(),
					UserActions.getOrganization()
				)),
				catchError((error): Observable<Action> => of(CustomizationActions.saveOrganizationError(error)))
			))
	));

	public saveProfile$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.saveProfile),
		withLatestFrom(this.store$.pipe(select(createSelector((appState: any): CustomizationState => appState.customization, (state: CustomizationState): UserProfile | undefined => state.userProfile)))),
		notNull(),
		exhaustMap(([, userProfile]): Observable<Action> =>
			this.backendService.user.profile.save.post$(userProfile as UserProfile).pipe(
				switchMap((): Observable<Action> => of(
					CustomizationActions.saveProfileSuccess(),
					UserActions.getProfile()
				)),
				catchError((error): Observable<Action> => of(CustomizationActions.saveProfileError(error)))
			))
	));

	public updateStoragesListFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.updateStoragesListFilter),
		exhaustMap((action): Observable<Action> => this.backendService.user.storages.list.get$(action.filter).pipe(
			map((storagesList): Action => CustomizationActions.updateStoragesListSuccess(storagesList)),
			catchError((error): Observable<Action> => of(CustomizationActions.updateStoragesListError(error)))
		))
	));

	public getPartners$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.getPartners),
		exhaustMap((action): Observable<Action> => this.backendService.organization.partners.list.get$(action.partnersParams).pipe(
			map((partnersList): Action => CustomizationActions.getPartnersSuccess(partnersList)),
			catchError((error): Observable<Action> => of(CustomizationActions.getPartnersError(error)))
		))
	));

	public updateCountriesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.updateCountriesFilter),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.countries.list.get$(action.filter).pipe(
			map((countries): Action => CustomizationActions.getCountriesSuccess(countries)),
			catchError((error): Observable<Action> => of(CustomizationActions.getCountriesError(error)))
		))
	));

	public updateRegionsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.updateRegionsFilter),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.regions.list.get$(action.filter).pipe(
			map((regions): Action => CustomizationActions.getRegionsSuccess(regions)),
			catchError((error): Observable<Action> => of(CustomizationActions.getRegionsError(error)))
		))
	));

	public updateStreetsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.updateStreetsFilter),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.streets.types.list.get$(action.filter).pipe(
			map((streets): Action => CustomizationActions.getStreetsSuccess(streets)),
			catchError((error): Observable<Action> => of(CustomizationActions.getStreetsError(error)))
		))
	));

	public saveStorage$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(CustomizationActions.saveStorage),
		exhaustMap((action): Observable<Action> =>
			this.backendService.storages.list.put$(action.storage).pipe(
				map((): Action => CustomizationActions.saveStorageSuccess()),
				catchError((error): Observable<Action> => error.status === 400 ?
					of(CustomizationActions.storageError(error.error)) : of(CustomizationActions.otherStorageError(error)))
			))
	));

	constructor(
		private readonly customizationErrorService: CustomizationErrorService,
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
		private readonly store$: Store<CustomizationState>,
	) { }
}
