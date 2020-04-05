import { Injectable } from "@angular/core";
import * as EinvoiceSigned from "./einvoice-signed.actions";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { ofType, Actions, createEffect } from "@ngrx/effects";
import { exhaustMap, map, catchError } from "rxjs/operators";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Einvoice } from "@helper/abstraction/einvoice";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class EinvoiceSignedEffects {
	public getEinvoiceDocument$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceSigned.getEinvoiceDocument),
		exhaustMap((action): Observable<Action> =>
			this.userBackendService.einvoice.get$(action.draftId).pipe(
				map((value: Einvoice) => EinvoiceSigned.getEinvoiceDocumentSuccess(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(EinvoiceSigned.getEinvoiceDocumentError(err)))
			)
		)
	));

	public sendSignedEinvoiceDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(EinvoiceSigned.sendSignedEinvoiceDraft),
		exhaustMap(({ draftType, draftId }) => this.userBackendService.activemq.send.get$(draftId, draftType).pipe(
			map(() => EinvoiceSigned.sendSignedEinvoiceDraftSuccess()),
			catchError(e => of(EinvoiceSigned.sendSignedEinvoiceDraftError(e)))
		))
	));
	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
