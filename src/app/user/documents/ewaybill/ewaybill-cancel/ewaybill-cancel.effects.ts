import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import * as CancelEwaybillActions from "./ewaybill-cancel.actions";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import * as DocumentActions from "../../documents.actions";
import { startWith, map, exhaustMap, take, catchError, switchMap } from "rxjs/operators";
import { Draft } from "../../draft";

@Injectable()
export class EwaybillCancelEffects {
	public getSignedAndCanceledDraftThenSaveDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(CancelEwaybillActions.getSignedAndCanceledDraftThenSaveDraft),
		switchMap((action) =>
			this.actions.pipe(
				ofType(DocumentActions.signingDraftSuccess),
				take(1),
				map(creatingAction => CancelEwaybillActions.sendSignedCancel({
					id: creatingAction.draft.documentId,
					messageType: creatingAction.draft.draftType,
					xmlBody: creatingAction.draft.xmlString
				})),
				startWith(CancelEwaybillActions.getCanceledAndSignedDraft({
					draftType: action.draftType,
					documentId: action.documentId,
					document: action.document,
				}))
			)
		)
	));

	public getCanceledAndSignedDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(CancelEwaybillActions.getCanceledAndSignedDraft),
		exhaustMap((action) =>
			this.actions.pipe(
				ofType(CancelEwaybillActions.cancelEwaybillSuccess),
				take(1),
				map(creatingAction => DocumentActions.signDraft(creatingAction.draft, true, true)),
				startWith(CancelEwaybillActions.cancelEwaybill({
					draftType: action.draftType,
					documentId: action.documentId,
					document: action.document,
				}))
			)
		)
	));

	public cancelEwaybill$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(CancelEwaybillActions.cancelEwaybill),
		exhaustMap((action): Observable<Action> => this.userBackendService.ewaybill.cancel.get$(action.documentId).pipe(
			map(xml =>
				CancelEwaybillActions.cancelEwaybillSuccess(
					new Draft(action.documentId, action.draftType, action.document, xml)
				)
			),
			catchError(error => of(CancelEwaybillActions.cancelEwaybillError(error)))
		))
	));

	public sendSignedCancel$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(CancelEwaybillActions.sendSignedCancel),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.saveSignedCancel.post$(action.id, action.messageType, action.xmlBody).pipe(
			map((): Action => CancelEwaybillActions.sendSignedCancelSuccess()),
			catchError(err => of(CancelEwaybillActions.sendSignedCancelError(err)))
		))
	));

	public cancelingDraftSuccess$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(DocumentActions.saveSignedDraftSuccess, CancelEwaybillActions.sendSignedCancelSuccess),
		map(() => CancelEwaybillActions.cancelingDraftSuccess())
	));

	public errorCancelingDraft$ = createEffect((): Observable<Action> => this.actions.pipe(
		ofType(CancelEwaybillActions.cancelEwaybillError, CancelEwaybillActions.sendSignedCancelError, DocumentActions.signingDraftError, DocumentActions.saveSignedDraftError),
		map(action => CancelEwaybillActions.errorCancelingEwaybill(action.error))
	));

	constructor(
		private actions: Actions,
		private userBackendService: UserBackendService
	) { }
}
