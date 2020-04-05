import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import * as EinvoicepmtActions from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.actions";
import {
	catchError,
	exhaustMap,
	filter,
	map,
	startWith,
	switchMap,
	take,
	tap
} from "rxjs/operators";
import { documentState } from "@helper/paths";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import * as DocumentActions from "@app/user/documents/documents.actions";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

@Injectable()
export class EinvoicepmtEffects {
	public saveEinvoicepmtDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.saveEinvoicepmtDraft),
		exhaustMap((action): Observable<Action> => {
			return this.userBackendService.draft.saveBLRPMT.post$(action.document).pipe(
				map((id: number): Action => EinvoicepmtActions.saveEinvoicepmtDraftSuccess(id)),
				catchError((error): Observable<Action> => of(EinvoicepmtActions.saveEinvoicepmtDraftError(error))),
			);
		})
	));

	public saveEinvoicepmtDraftSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(EinvoicepmtActions.saveEinvoicepmtDraftSuccess),
		tap(() => this.navigateToDraft())
	), { dispatch: false });

	public getEinvoicepmtDocument$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.getEinvoicepmtDocument),
		exhaustMap((action): Observable<Action> =>
			this.userBackendService.einvoicepmt.get$(action.draftId).pipe(
				map((value: EinvoicepmtDto) => EinvoicepmtActions.getEinvoicepmtDocumentSuccess(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(EinvoicepmtActions.getEinvoicepmtDocumentError(err)))
			)
		)
	));

	public deleteEinvoicepmt$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.deleteEinvoicepmtDraft),
		exhaustMap((action): Observable<Action> => this.userBackendService.draft.delete(action.orderType, [action.orderId]).pipe(
			map((): Action => EinvoicepmtActions.deleteEinvoicepmtDraftSuccess()),
			catchError((error: Error) => of(EinvoicepmtActions.deleteEinvoicepmtDraftError(error)))
		))
	));

	public getEinvoicepmtDocumentDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.getEinvoicepmtDocumentDraft),
		exhaustMap((action): Observable<Action> =>
			this.userBackendService.einvoicepmt.draft.get$<EinvoicepmtDto>(action.draftId).pipe(
				map((value: EinvoicepmtDto) => EinvoicepmtActions.getEinvoicepmtDocumentDraftSuccess(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(EinvoicepmtActions.getEinvoicepmtDocumentDraftError(err)))
			)
		)
	));

	public signingEinvoicepmtDocumentError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.signingDraftError, DocumentActions.saveSignedDraftError, DocumentActions.creatingWithValidationError),
		map(action => EinvoicepmtActions.signingEinvoicepmtDocumentError(action.error))
	));

	public getEinvoicepmtDraftNumber$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.getEinvoicepmtDraftNumber),
		exhaustMap((): Observable<Action> => this.userBackendService.einvoicepmt.uniqueNumber.get$().pipe(
			map(dto => EinvoicepmtActions.getEinvoicepmtDraftNumberSuccess(dto.uniqueNumber))
		))
	));

	public signingDraftSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.signingDraftSuccess),
		filter(action => !action.withoutSave),
		map(action => DocumentActions.saveSignedDraft(action.draft))
	));

	// это испольуется чтобы в редъюсере поставить статус ок
	public saveSignedEinvoicepmtDraftSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.saveSignedDraftSuccess),
		map(() => EinvoicepmtActions.saveSignedEinvoicepmtDraftSuccess())
	));

	// это испольуется чтобы в редъюсере поставить статус пендинга
	public createEinvoicepmtDraftThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.createDraftThenSign),
		map(() => EinvoicepmtActions.createEinvoicepmtDraftThenSign())
	));

	public sendSignedEinvoicepmtDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.sendSignedEinvoicepmtDraft),
		exhaustMap(({ draftType, draftId }): Observable<Action> => this.userBackendService.activemq.send.get$(draftId, draftType).pipe(
			map(() => EinvoicepmtActions.sendSignedEinvoicepmtDraftSuccess()),
			catchError(e => of(EinvoicepmtActions.sendSignedEinvoicepmtDraftError(e)))
		))
	));

	public confirmEinvoicepmtReceipt$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.confirmEinvoicepmtReceipt),
		switchMap((action): Observable<Action> => this.userBackendService.einvoicepmt.blrapn.create2650ByEinvoicepmt.post$(action.documentId).pipe(
			exhaustMap((blrapnDto) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.userBackendService.einvoicepmt.blrapn.saveSigned2650ByEinvoicepmt.post$(blrapnDto.blrapnDraftId, action2.signedDocument.signedXml).pipe(
							map((): Action => EinvoicepmtActions.confirmEinvoicepmtReceiptSuccess()),
							catchError(err => of(EinvoicepmtActions.confirmEinvoicepmtReceiptError(err)))
						)
					),
					catchError(err => of(EinvoicepmtActions.confirmEinvoicepmtReceiptError(err))),
					startWith(DocumentActions.signDocument(blrapnDto.xml))
				),
			),
			catchError(err => of(EinvoicepmtActions.confirmEinvoicepmtReceiptError(err)))
		)),
	));

	public checkSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.checkSign),
		exhaustMap((action): Observable<Action> => this.userBackendService.einvoicepmt.checkSign.get$(action.params.documentId).pipe(
			map((value: boolean): Action => EinvoicepmtActions.checkSignSuccess(value)),
			catchError((err: Error) => of(EinvoicepmtActions.checkSignError(err)))
		))
	));

	public confirmError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.confirmEinvoicepmtReceiptError, DocumentActions.signDocumentError),
		map(action => EinvoicepmtActions.confirmError(action.errors))
	));

	public getProviderConfirmation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EinvoicepmtActions.getProviderConfirmation),
		exhaustMap((action): Observable<Action> => this.userBackendService.provider.provider.EINVOICEPMT.get$(action.id).pipe(
			map((value: ProviderConfirmation): Action => EinvoicepmtActions.getProviderConfirmationSuccess(value)),
			catchError((error) => of(EinvoicepmtActions.getProviderConfirmationError(error)))
		))
	));

	public openSignedDraft = createEffect((): Observable<{}> => this.actions$.pipe(
		ofType(EinvoicepmtActions.openSignedDraft),
		tap((action) => this.router.navigate(["user", "documents", "EINVOICEPMT", "signed-draft", action.signedDraft.documentId]))
	), { dispatch: false });

	public navigateToDraft$ = createEffect(() => this.actions$.pipe(
		ofType(EinvoicepmtActions.deleteEinvoicepmtDraftSuccess),
		tap(() => this.navigateToDraft())
	), { dispatch: false });

	public navigateToIncoming$ = createEffect(() => this.actions$.pipe(
		ofType(EinvoicepmtActions.confirmEinvoicepmtReceiptSuccess),
		tap(() => this.navigateToIncoming())
	), { dispatch: false });

	public navigateToOutgoing$ = createEffect(() => this.actions$.pipe(
		ofType(EinvoicepmtActions.sendSignedEinvoicepmtDraftSuccess),
		tap(() => this.navigateToOutgoing())
	), { dispatch: false });

	constructor(
		private readonly userBackendService: UserBackendService,
		private readonly actions$: Actions,
		private readonly router: Router
	) { }

	public navigateToDraft(): void {
		this.router.navigate(
			["user", "documents", "EINVOICEPMT", documentState.draft],
		);
	}

	public navigateToIncoming(): void {
		this.router.navigate(
			["user", "documents", "EINVOICEPMT", documentState.incoming],
		);
	}

	public navigateToOutgoing(): void {
		this.router.navigate(
			["user", "documents", "EINVOICEPMT", documentState.outgoing],
		);
	}
}

