import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Observable, of } from "rxjs";
import * as EinvoiceResponse from "./einvoice-response.actions";
import { switchMap, catchError, map } from "rxjs/operators";
import { Action } from "@ngrx/store";

@Injectable()
export class EinvoiceResponseEffects {
	public signEinvocieResponse$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceResponse.signEinvocieResponse),
		switchMap((action): Observable<Action> => this.userBackendService.einvoice.getEinvoiceResponse.get$(action.documentId).pipe(
			switchMap((response): Observable<Action> => this.userBackendService.signing.post$(response.xmlBody, new Date()).pipe(
				map(signedDraft => EinvoiceResponse.signEinvocieResponseSuccess(signedDraft, `${response.id}`)),
				catchError(error => of(EinvoiceResponse.signEinvocieResponseError(error)))
			)),
			catchError((error): Observable<Action> => of(EinvoiceResponse.signEinvocieResponseError(error))
			)
		))
	));

	public signEinvocieResponseSuccess$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceResponse.signEinvocieResponseSuccess),
		map(action => EinvoiceResponse.saveResponseSignedEinvoice(action.signedDraft, action.id))
	));

	public saveResponseSignedEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceResponse.saveResponseSignedEinvoice),
		switchMap((action): Observable<Action> => this.userBackendService.einvoice.saveSignedResponse.post$({ id: action.id, xmlBody: action.signedEinvoice.signedXml }).pipe(
			map(() => EinvoiceResponse.saveResponseSignedEinvoiceSuccess(+action.id)),
			catchError(error => of(EinvoiceResponse.saveResponseSignedEinvoiceError(error)))
		))
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
