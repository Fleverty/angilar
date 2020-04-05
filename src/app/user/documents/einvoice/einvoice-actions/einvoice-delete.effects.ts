import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { deleteEinvoice, deleteEinvoiceSuccess, deleteEinvoiceError } from "./einvoice-delete.actions";
import { exhaustMap, map, catchError } from "rxjs/operators";

@Injectable()
export class EinvoiceDeleteEffects {

	public deleteEinvoice$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(deleteEinvoice),
		exhaustMap((action): Observable<Action> => this.userBackendService.einvoice.delete([+action.draftId]).pipe(
			map((): Action => deleteEinvoiceSuccess()),
			catchError((error): Observable<Action> => of(deleteEinvoiceError(error)))
		))
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
