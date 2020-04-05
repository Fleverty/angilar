import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import * as EinvoiceCancel from "./einvoice-cancel.actions";

@Injectable()
export class EinvoiceCancelEffects {
	public cancelEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.cancelEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.einvoice.cancelEinvoice.get$(action.documentId).pipe(
			switchMap((response): Observable<Action> => this.userBackendService.signing.post$(response.xmlBody, new Date()).pipe(
				map(signedDraft => EinvoiceCancel.cancelEinvoiceSuccess(signedDraft, `${response.id}`)),
				catchError(error => of(EinvoiceCancel.cancelEinvoiceError(error)))
			)),
			catchError((error): Observable<Action> => of(EinvoiceCancel.cancelEinvoiceError(error))
			)
		))
	));

	public cancelEinvoiceSuccess$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.cancelEinvoiceSuccess),
		map(action => EinvoiceCancel.saveSignedCanceledEinvoice(action.signedDraft, action.id))
	));

	public saveSignedCanceledEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.saveSignedCanceledEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.draft.saveSignedCancel.post$(action.id, "BLRINV", action.signedEinvoice.signedXml).pipe(
			map(() => EinvoiceCancel.saveSignedCanceledEinvoiceSuccess(action.id)),
			catchError(error => of(EinvoiceCancel.saveSignedCanceledEinvoiceError(error)))
		))
	));

	public confirmCancelEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.confirmCancelEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.draft.blrapn.create2650OnEinvoiceCancel.post$(+action.documentId).pipe(
			switchMap((blrapnDto): Observable<Action> => this.userBackendService.signing.post$(blrapnDto.xml, new Date()).pipe(
				map(signedDraft => EinvoiceCancel.confirmCancelEinvoiceSuccess(signedDraft, `${blrapnDto.blrapnDraftId}`)),
				catchError(error => of(EinvoiceCancel.confirmCancelEinvoiceError(error)))
			)),
			catchError(error => of(EinvoiceCancel.confirmCancelEinvoiceError(error)))
		)),
	));

	public confirmCancelEinvoiceSuccess$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.confirmCancelEinvoiceSuccess),
		map(action => EinvoiceCancel.saveSignedConfirmationCancellationEinvoice(action.signedDraft, action.id))
	));

	public saveSignedConfirmationCancellationEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceCancel.saveSignedConfirmationCancellationEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.draft.blrapn.saveSigned2650OnEinvoiceCancel.post$(+action.id, action.signedEinvoice.signedXml).pipe(
			map(() => EinvoiceCancel.saveSignedConfirmationCancellationSuccess(action.id)),
			catchError(error => of(EinvoiceCancel.saveSignedConfirmationCancellationEinvoiceError(error)))
		))
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
