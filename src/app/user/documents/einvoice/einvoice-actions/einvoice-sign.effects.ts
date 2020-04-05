import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import * as EinvoiceSign from "./einvoice-sign.actions";

@Injectable()
export class EinvoiceSignEffects {
	public signEinvoiceDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceSign.signEinvocieDraft),
		switchMap((action): Observable<Action> => this.userBackendService.draft.createWithValidation.post$("BLRINV", action.einvoice).pipe(
			switchMap((response): Observable<Action> => this.userBackendService.signing.post$(response.xmlBody, new Date()).pipe(
				map(signedDraft => EinvoiceSign.signEinvocieDraftSuccess(signedDraft, `${response.id}`)),
				catchError(error => of(EinvoiceSign.signEinvocieDraftError(error)))
			)),
			catchError((error): Observable<Action> => of(EinvoiceSign.signEinvocieDraftError(error))
			)
		))
	));

	public signingDraftSuccess$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceSign.signEinvocieDraftSuccess),
		map(action => EinvoiceSign.saveSignedEinvoiceDraft(action.signedDraft, action.id))
	));

	public saveSignedEinvoiceDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceSign.saveSignedEinvoiceDraft),
		switchMap((action): Observable<Action> => this.userBackendService.draft.saveSigned.post$("BLRINV", { id: action.id, xmlBody: action.signedEinvoice.signedXml }).pipe(
			map(() => EinvoiceSign.saveSignedEinvoiceDraftSuccess(+action.id)),
			catchError(error => of(EinvoiceSign.saveSignedEinvoiceDraftError(error)))
		))
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
