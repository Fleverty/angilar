import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { saveEinvocieDraft, saveEinvocieDraftSuccess, saveEinvocieDraftError, getEinvocieDraft, getEinvocieDraftSuccess, getEinvocieDraftError } from "./einvoice-draft.actions";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

@Injectable()
export class EinvoiceDraftEffects {
	public saveEinvoiceDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(saveEinvocieDraft),
		switchMap(action => {
			return this.userBackendService.draft.saveBLRINV.post$(action.einvoice).pipe(
				map((id: number): Action => saveEinvocieDraftSuccess(id)),
				catchError((error): Observable<Action> => of(saveEinvocieDraftError(error))),
			);
		})
	));

	public getEinvoiceDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(getEinvocieDraft),
		switchMap(action => {
			return this.userBackendService.einvoice.getDraft$(action.id).pipe(
				map(data => getEinvocieDraftSuccess(data)),
				catchError((error): Observable<Action> => of(getEinvocieDraftError(error))),
			);
		})
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
