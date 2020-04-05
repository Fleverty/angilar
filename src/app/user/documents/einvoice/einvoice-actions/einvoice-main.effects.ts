import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import * as EinvoiceMainActions from "./einvoice-main.actions";
import { exhaustMap, map, catchError, switchMap } from "rxjs/operators";
import * as DocumentActions from "./../../documents.actions";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

@Injectable()
export class EinvoiceMainEffects {
	public checkSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.checkSign),
		exhaustMap((action): Observable<Action> => this.userBackendService.einvoice.checkSign.get$(action.params.documentId).pipe(
			map((value: boolean): Action => EinvoiceMainActions.checkSignSuccess(value)),
			catchError((err: Error) => of(EinvoiceMainActions.checkSignError(err)))
		))
	));

	public getEinvoiceDraftNumberSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.getEinvoiceDraftNumberSuccess),
		map(action => EinvoiceMainActions.getEinvoiceDraftNumberSuccess(action.documentDraftNumber))
	));

	public updateUnitOfMeasuresFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.updateUnitOfMeasuresFilter),
		exhaustMap((action): Observable<Action> => this.userBackendService.nsi.uom.list.get$(action.filter, "EINVOICE").pipe(
			map((unitOfMeasures): Action => EinvoiceMainActions.getUnitOfMeasuresSuccess(unitOfMeasures)),
			catchError((error): Observable<Action> => of(EinvoiceMainActions.getUnitOfMeasuresError(error)))
		))
	));

	public updateCountriesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.updateCountriesFilter),
		exhaustMap((action): Observable<Action> => this.userBackendService.nsi.countries.list.get$(action.filter).pipe(
			map((countries): Action => EinvoiceMainActions.getCountriesSuccess(countries)),
			catchError((error): Observable<Action> => of(EinvoiceMainActions.getCountriesError(error)))
		))
	));

	public updateProductExtraFieldsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.updateProductExtraFieldsFilter),
		exhaustMap((action): Observable<Action> => this.userBackendService.nsi.item.extraFields.list.get$(action.filter).pipe(
			map((productExtraFields): Action => EinvoiceMainActions.getProductExtraFieldsSuccess(productExtraFields)),
			catchError((error): Observable<Action> => of(EinvoiceMainActions.getProductExtraFieldsError(error)))
		))
	));

	public getProviderConfirmation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.getProviderConfirmation),
		exhaustMap((action): Observable<Action> => this.userBackendService.provider.provider.EINVOICE.get$(action.id).pipe(
			map((value: ProviderConfirmation): Action => EinvoiceMainActions.getProviderConfirmationSuccess(value)),
			catchError((error) => of(EinvoiceMainActions.getProviderConfirmationError(error)))
		))
	));

	public creatEditedEinvoice$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.creatEditedEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.draft.blrapn.create2750ByEinvoice.post$({ documentId: action.id, changeReason: action.changeReason }).pipe(
			switchMap((response): Observable<Action> => this.userBackendService.signing.post$(response.xml, new Date()).pipe(
				map(signedDraft => EinvoiceMainActions.creatEditedEinvoiceSuccess(signedDraft, `${response.blrapnDraftId}`)),
				catchError(error => of(EinvoiceMainActions.creatEditedEinvoiceError(error)))
			)),
			catchError(error => of(EinvoiceMainActions.creatEditedEinvoiceError(error)))
		))
	));

	public creatEditedEinvoiceSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.creatEditedEinvoiceSuccess),
		map(action => EinvoiceMainActions.saveSignedBlrapnEinvoice(action.signedDraft, action.id))
	));

	public saveSignedBlrapnEinvoice$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoiceMainActions.saveSignedBlrapnEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.draft.blrapn.saveSigned2750ByEinvoice.post$({ blrapnDraftId: +action.id, xml: action.signedDraft.signedXml }).pipe(
			map(() => EinvoiceMainActions.saveSignedBlrapnEinvoiceSuccess()),
			catchError((error) => of(EinvoiceMainActions.saveSignedBlrapnEinvoiceError(error)))
		))
	));

	constructor(
		private actions$: Actions,
		private userBackendService: UserBackendService
	) { }
}
