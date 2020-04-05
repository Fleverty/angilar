import { Observable, of } from "rxjs";
import { map, exhaustMap, catchError, take, startWith, switchMap, debounceTime, filter } from "rxjs/operators";

import { Injectable } from "@angular/core";
import { EwaybillProduct, Ewaybill, ResponseDraftInfo } from "@helper/abstraction/ewaybill";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, createSelector } from "@ngrx/store";

import * as EwaybillActions from "./ewaybill.actions";
import { EwaybillState } from "./ewaybill.reducer";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { TotalSums } from "./ewaybill";
import { Router } from "@angular/router";
import { OrganizationDto } from "@helper/abstraction/organization";
import { ewaybillSaveValidationError, resetDocumentFilter } from "../documents.actions";
import { HttpErrorResponse } from "@angular/common/http";
import * as DocumentActions from "../documents.actions";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";
import * as DocumentsActions from "@app/user/documents/documents.actions";
import { documentState } from "@helper/paths";

@Injectable()
export class EwaybillEffects {
	public readonly productSelector = createSelector((appState: any): EwaybillState => appState.ewaybill, (state: EwaybillState): EwaybillProduct[] => state.products);
	public readonly totalSumsSelector = createSelector((appState: any): EwaybillState => appState.ewaybill, (state: EwaybillState): TotalSums => state.totalSums);
	public readonly isAutoSumsSelector = createSelector((appState: any): EwaybillState => appState.ewaybill, (state: EwaybillState): boolean => state.isAutoSum);

	public updateCurrenciesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateCurrenciesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.currencies.list.get$(action.filter).pipe(
			map((currencies): Action => EwaybillActions.getCurrenciesSuccess(currencies)),
			catchError((error): Observable<Action> => of(EwaybillActions.getCurrenciesError(error)))
		))
	));

	public updateConsigneesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateConsigneesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.organization.consignees.list.get$(action.filter).pipe(
			map((consignees): Action => EwaybillActions.getConsigneesSuccess(consignees)),
			catchError((error): Observable<Action> => of(EwaybillActions.getConsigneesError(error)))
		))
	));

	public updateGeneralGLNsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateGeneralGLNsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.generalGLN.list.get$(action.filter).pipe(
			map((generalGLN): Action => EwaybillActions.getGeneralGLNsSuccess(generalGLN)),
			catchError((error): Observable<Action> => of(EwaybillActions.getGeneralGLNsError(error)))
		))
	));

	public updateLoadingPointsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateLoadingPointsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.organization.storages.list.getByStorageType$(action.filter).pipe(
			map((loadingPoint): Action => EwaybillActions.getLoadingPointsSuccess(loadingPoint)),
			catchError((error): Observable<Action> => of(EwaybillActions.getLoadingPointsError(error)))
		))
	));

	public updateUnloadingPointsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateUnloadingPointsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => {
			if (action.filter.partnerId) {
				return this.backendService.organization.storages.list.getByStorageType$(action.filter).pipe(
					map((unloadingPoint): Action => EwaybillActions.getUnloadingPointsSuccess(unloadingPoint)),
					catchError((error): Observable<Action> => of(EwaybillActions.getUnloadingPointsError(error)))
				);
			} else {
				return of(EwaybillActions.getUnloadingPointsSuccess([]));
			}
		})
	));

	public updateExtraFieldsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateExtraFieldsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.extraFields.list.get$(action.filter).pipe(
			map((extraFields): Action => EwaybillActions.getExtraFieldsSuccess(extraFields)),
			catchError((error): Observable<Action> => of(EwaybillActions.getExtraFieldsError(error)))
		))
	));

	public updateResponseExtraFieldsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateResponseExtraFieldsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.consignees.extraFields.list.get$(action.filter).pipe(
			map((extraFields): Action => EwaybillActions.getResponseExtraFieldsSuccess(extraFields)),
			catchError((error): Observable<Action> => of(EwaybillActions.getResponseExtraFieldsError(error)))
		))
	));


	public updateUnitOfMeasuresFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateUnitOfMeasuresFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.uom.list.get$(action.filter, "EWAYBILL").pipe(
			map((unitOfMeasures): Action => EwaybillActions.getUnitOfMeasuresSuccess(unitOfMeasures)),
			catchError((error): Observable<Action> => of(EwaybillActions.getUnitOfMeasuresError(error)))
		))
	));

	public updateCountriesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateCountriesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.countries.list.get$(action.filter).pipe(
			map((countries): Action => EwaybillActions.getCountriesSuccess(countries)),
			catchError((error): Observable<Action> => of(EwaybillActions.getCountriesError(error)))
		))
	));

	public updateDocumentTypesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateDocumentTypesFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.certificates.types.list.get$(action.filter).pipe(
			map((documentTypes): Action => EwaybillActions.getDocumentTypesSuccess(documentTypes)),
			catchError((error): Observable<Action> => of(EwaybillActions.getDocumentTypesError(error)))
		))
	));

	public updateProductExtraFieldsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateProductExtraFieldsFilter),
		debounceTime(250),
		exhaustMap((action): Observable<Action> => this.backendService.nsi.item.extraFields.list.get$(action.filter).pipe(
			map((productExtraFields): Action => EwaybillActions.getProductExtraFieldsSuccess(productExtraFields)),
			catchError((error): Observable<Action> => of(EwaybillActions.getProductExtraFieldsError(error)))
		))
	));

	public saveDraftTransportEwaybill$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.saveTransportDocument),
		exhaustMap((action): Observable<Action> => {
			return this.backendService.draft.saveBLRWBL.post$(action.document).pipe(
				map((id: number): Action => EwaybillActions.saveDocumentSuccess(id)),
				catchError((error): Observable<Action> => of(EwaybillActions.saveDocumentError(error))),
			);
		})
	));


	public saveDraftEwaybill$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.saveDocument),
		exhaustMap((action): Observable<Action> => {
			return this.backendService.draft.saveBLRDLN.post$(action.document).pipe(
				map((id: number): Action => EwaybillActions.saveDocumentSuccess(id)),
				catchError((error): Observable<Action> => of(EwaybillActions.saveDocumentError(error))),
			);
		})
	));

	public saveDocumentSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.saveDocumentSuccess),
		map((action) => {
			this.router.navigate(
				["user", "documents", "EWAYBILL", documentState.draft],
			);
			return EwaybillActions.setIdOfDocument(action.id);
		})
	));

	public signingEwaybillDocumentError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.signingDraftError, DocumentActions.saveSignedDraftError, DocumentActions.creatingWithValidationError),
		map(action => EwaybillActions.signingEwaybillDocumentError(action.error))
	));

	public signingDraftSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.signingDraftSuccess),
		filter(action => !action.withoutSave),
		map(action => DocumentActions.saveSignedDraft(action.draft))
	));

	// это испольуется чтобы в редъюсере поставить статус ок
	public saveSignedEwaybillDraftSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.saveSignedDraftSuccess),
		map(() => EwaybillActions.saveSignedEwaybillDraftSuccess())
	));

	// это испольуется чтобы в редъюсере поставить статус пендинга
	public createEwaybillDraftThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.createDraftThenSign),
		map(() => EwaybillActions.createEwaybillDraftThenSign())
	));

	public getEwaybill$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.getEwaybill),
		exhaustMap((action): Observable<Action> =>
			this.backendService.draft.find.get$<Ewaybill>(action.draftType, action.draftId).pipe(
				map((value: Ewaybill) => EwaybillActions.setEwaybill(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => {
					return of(EwaybillActions.setValidationError(err));
				})
			)
		),
	));

	public getEwaybillResponse$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.getEwaybillResponse),
		exhaustMap((action): Observable<Action> =>
			this.backendService.draft.response.find$<Ewaybill>(action.draftType, +action.draftId).pipe(
				map((value: Ewaybill) => EwaybillActions.setEwaybill(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(EwaybillActions.setValidationError(err)))
			)
		)
	));

	public getEwaybillDocument$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.getEwaybillDocument),
		exhaustMap((action): Observable<Action> =>
			this.backendService.ewaybill.get$(action.draftId).pipe(
				map((value: Ewaybill) => EwaybillActions.getEwaybillDocumentSuccess(value)),
				catchError((err: HttpErrorResponse): Observable<Action> => of(EwaybillActions.getEwaybillDocumentError(err)))
			)
		)
	));

	public initCreateEwaybill$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.initEwaybill),
		exhaustMap((): Observable<Action> => this.backendService.organization.get$().pipe(
			map((value: OrganizationDto) => {
				const ewaybill: Ewaybill = {
					testIndicator: false,
					processingStatus: "0",
					deliveryNoteNumber: `${value.ewaybillProviderCode}-${value.gln}`,
					shipperId: value.id,
					shipperName: value.name,
					shipperAddress: value.addressFull,
					shipperGln: value.gln,
					shipperUnp: value.unp,
					msgEwaybillProductList: [],
				};
				return EwaybillActions.setEwaybill(ewaybill);
			}),
			catchError((err: HttpErrorResponse): Observable<Action> => {
				return of(EwaybillActions.setValidationError(err));
			})
		))
	));

	public ewaybillSaveValidationError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(ewaybillSaveValidationError),
		exhaustMap((action): Observable<Action> => of(EwaybillActions.setValidationError(action.error)))
	));

	public deleteEwaybill$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.deleteEwaybill),
		exhaustMap((action): Observable<Action> => this.backendService.draft.delete(action.draftType, [+action.draftId]).pipe(
			map((): Action => EwaybillActions.deleteEwaybillSuccess()),
			catchError((error): Observable<Action> => of(EwaybillActions.deleteEwaybillError(error)))
		))
	));

	public deleteEwaybillSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.deleteEwaybillSuccess),
		map((): Action => {
			this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft]);
			return EwaybillActions.resetEwaybill();
		})
	));

	public deleteEwaybillResponse$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.deleteEwaybillResponse),
		exhaustMap((action): Observable<Action> => this.backendService.draft.response.delete$(action.draftType, +action.draftId).pipe(
			map((): Action => EwaybillActions.deleteEwaybillSuccess()),
			catchError((error): Observable<Action> => of(EwaybillActions.deleteEwaybillError(error)))
		))
	));

	public updateEwaybillResponse$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.updateEwaybillResponse),
		exhaustMap((action): Observable<Action> => action.draftType === "BLRDNR"
			? this.backendService.draft.response.updateBLRDNR(action.draftType, action.ewaybillReponse).pipe(
				map((): Action => EwaybillActions.updateEwaybillResponseSuccess()),
				catchError((error: Error): Observable<Action> => of(EwaybillActions.updateEwaybillResponseFailed(error)))
			)
			: this.backendService.draft.response.updateBLRWBR(action.draftType, action.ewaybillReponse).pipe(
				map((): Action => EwaybillActions.updateEwaybillResponseSuccess()),
				catchError((error: Error): Observable<Action> => of(EwaybillActions.updateEwaybillResponseFailed(error)))
			))
	));

	public getEwaybillDraftNumberSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.getDraftNumberSuccess),
		map(action => EwaybillActions.getEwaybillDraftNumberSuccess(action.documentDraftNumber))
	));


	public sendSignedEwaybillDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.sendSignedEwaybillDraft),
		exhaustMap(({ draftType, draftId }) => this.backendService.activemq.send.get$(draftId, draftType).pipe(
			map(() => EwaybillActions.sendSignedEwaybillDraftSuccess()),
			catchError(e => of(EwaybillActions.sendSignedEwaybillDraftError(e)))
		))
	));

	public sendSignedEwaybillDraftSuccess$ = createEffect((): Observable<any> => this.actions$.pipe(
		ofType(EwaybillActions.sendSignedEwaybillDraftSuccess),
		map(() => { this.router.navigateByUrl("/user/documents/EWAYBILL/draft"); })
	), { dispatch: false });

	public processReceivedEwaybill$ = createEffect(() => this.actions$.pipe(
		ofType(EwaybillActions.processReceivedEwaybill),
		exhaustMap((action): Observable<Action> => {
			const responseType: "BLRWBR" | "BLRDNR" = action.docInfo.documentType === "BLRWBL" ? "BLRWBR" : "BLRDNR";
			return this.backendService.draftResponse.saveBasedOnEwaybill[responseType].post$(action.docInfo.responseId).pipe(
				exhaustMap((value: ResponseDraftInfo): Observable<Action> => of(EwaybillActions.processReceivedEwaybillSuccess({ responseId: value.id, documentType: responseType, status: value.processingStatus }), resetDocumentFilter("EWAYBILL"))),
				catchError((err: HttpErrorResponse): Observable<Action> => {
					return of(EwaybillActions.processReceivedEwaybillError(err));
				})
			);
		})
	));

	public processReceivedEwaybillSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(EwaybillActions.processReceivedEwaybillSuccess),
		exhaustMap((action): Observable<Action> => {
			if (action.docInfo.status.id === "DRAFT") {
				this.router.navigate(["user", "documents", "EWAYBILL", "draft", "response", action.docInfo.documentType, action.docInfo.responseId]);
			} else {
				this.router.navigate(["user", "documents", "EWAYBILL", "response", "sign-draft", action.docInfo.documentType, action.docInfo.responseId]);
			}
			return of(EwaybillActions.resetEwaybillReceived());
		})
	));

	// public getReceivedEwaybill$ = createEffect(() => this.actions$.pipe(
	// 	ofType(EwaybillActions.getReceivedEwaybill),
	// 	exhaustMap((action): Observable<Action> => this.backendService.ewaybill.get$(+action.docInfo.documentId).pipe(
	// 		map((value: Ewaybill): Action => EwaybillActions.getReceivedEwaybillSuccess(value)),
	// 		catchError((err: HttpErrorResponse): Observable<Action> => of(EwaybillActions.getReceivedEwaybillError(err)))
	// 	)
	// 	)
	// ));


	public getResponseEwaybill$ = createEffect(() => this.actions$.pipe(
		ofType(EwaybillActions.getResponseEwaybillDraft),
		exhaustMap((action): Observable<Action> => this.backendService.draftResponse.find.get$(action.docInfo.documentType, action.docInfo.documentId).pipe(
			map((value: any): Action => EwaybillActions.getResponseEwaybillDraftSuccess(value)),
			catchError((err: HttpErrorResponse): Observable<Action> => of(EwaybillActions.getResponseEwaybillDraftError(err)))
		)
		)
	));

	public checkSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.checkSign),
		exhaustMap((action): Observable<Action> => this.backendService.ewaybill.checkSign.get$(action.params.documentId).pipe(
			map((value: boolean): Action => EwaybillActions.checkSignSuccess(value)),
			catchError((err: Error) => of(EwaybillActions.checkSignError(err)))
		))
	));


	public confirmEwaybillReceipt$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.confirmEwaybillReceipt),
		switchMap((action): Observable<Action> => this.backendService.draft.blrapn.create2650OnEwaybillCancel.post$(action.documentId).pipe(
			exhaustMap((blrapnDto) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.backendService.draft.blrapn.saveSigned2650OnEwaybillCancelAndSendByActiveMq.post$(blrapnDto.blrapnDraftId, action2.signedDocument.signedXml).pipe(
							map((): Action => EwaybillActions.confirmEwaybillReceiptSuccess()),
							catchError(err => of(EwaybillActions.confirmEwaybillReceiptError(err)))
						)
					),
					catchError(err => of(EwaybillActions.confirmEwaybillReceiptError(err))),
					startWith(DocumentActions.signDocument(blrapnDto.xml))
				),
			),
			catchError(err => of(EwaybillActions.confirmEwaybillReceiptError(err)))
		)),
	));

	public confirmError$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.confirmEwaybillReceiptError, DocumentActions.signDocumentError),
		map(action => EwaybillActions.confirmError(action.errors))
	));

	public createEwaybillThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.createEwaybillThenSign),
		switchMap((action): Observable<Action> => this.backendService.draft.blrapn.create2750ByEwaybill.post$({ documentId: action.documentId, changeReason: action.changeReason }).pipe(
			exhaustMap((creatingAction) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.backendService.draft.blrapn.saveSigned2750AndSendByActiveMq.post$({ blrapnDraftId: creatingAction.blrapnDraftId, xml: action2.signedDocument.signedXml }).pipe(
							map((): Action => EwaybillActions.saveSignedBLRAPNSuccess()),
							catchError(err => of(EwaybillActions.saveSignedBLRAPNError(err)))
						)),
					startWith(DocumentActions.signDocument(creatingAction.xml))
				)
			),
			catchError(err => of(EwaybillActions.createBLRAPNByEwaybillError(err)))
		))
	));

	public errorCreateEwaybillThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.saveSignedBLRAPNError, EwaybillActions.createBLRAPNByEwaybillError, DocumentActions.signDocumentError),
		map(action => EwaybillActions.errorCreateEwaybillThenSign(action.errors))
	));

	public findXmlThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.findXmlThenSign),
		switchMap((action): Observable<Action> => this.backendService.draftResponse.findXml.get$(action.draft.messageType, action.draft.draftId).pipe(
			exhaustMap((findXml) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.backendService.draftResponse.validateAndSaveSignedResponse.post$(action.draft.messageType, { id: action.draft.draftId, xmlBody: action2.signedDocument.signedXml }).pipe(
							map((): Action => EwaybillActions.validateAndSaveSignedSuccess()),
							catchError(err => of(EwaybillActions.validateAndSaveSignedError(err)))
						)),
					startWith(DocumentActions.signDocument(findXml.xmlBody))
				)
			),
			catchError(err => of(EwaybillActions.findXmlError(err)))
		))
	));

	public errorFindXmlThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.findXmlError, EwaybillActions.validateAndSaveSignedError, DocumentActions.signDocumentError),
		map(action => EwaybillActions.errorFindXmlThenSign(action.errors))
	));

	public getProviderConfirmation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.getProviderConfirmation),
		exhaustMap((action): Observable<Action> => this.backendService.provider.provider.EWAYBILL.get$(action.id).pipe(
			map((value: OperationsConfirmByProvider): Action => EwaybillActions.getProviderConfirmationSuccess(value)),
			catchError((err: Error) => of(EwaybillActions.getProviderConfirmationError(err)))
		))
	));

	public confirmEwaybillReceipt2651$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.confirmEwaybillReceipt2651),
		switchMap((action): Observable<Action> => this.backendService.draft.blrapn.create2651OnBlrapn2750.post$(action.documentId).pipe(
			exhaustMap((blrapnDto) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.backendService.draft.blrapn.saveSigned2651OnBlrapn2750AndSendByActiveMq.post$(blrapnDto.blrapnDraftId, action2.signedDocument.signedXml).pipe(
							map((): Action => EwaybillActions.confirmEwaybillReceipt2651Success()),
							catchError(err => of(EwaybillActions.confirmEwaybillReceipt2651Error(err)))
						)
					),
					catchError(err => of(EwaybillActions.confirmEwaybillReceipt2651Error(err))),
					startWith(DocumentActions.signDocument(blrapnDto.xml))
				),
			),
			catchError(err => of(EwaybillActions.confirmEwaybillReceipt2651Error(err)))
		))
	));

	public signEwaybillDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentActions.signDraft),
		map(action => EwaybillActions.signEwaybillDraft(action.draft.documentId))
	));

	public confirmEwaybillResponse$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(EwaybillActions.confirmEwaybillResponse),
		switchMap((action): Observable<Action> => this.backendService.draft.blrapn.create2650OnResponse.post$(action.responseId).pipe(
			switchMap((blrapnDto) =>
				this.actions$.pipe(
					ofType(DocumentActions.signDocumentSuccess),
					take(1),
					exhaustMap((action2): Observable<Action> =>
						this.backendService.draft.blrapn.saveSigned2650OnResponseAndSendByActiveMq.post$(blrapnDto.blrapnDraftId, action2.signedDocument.signedXml).pipe(
							map((): Action => EwaybillActions.confirmEwaybillResponseSuccess()),
							catchError(err => of(EwaybillActions.confirmEwaybillResponseError(err)))
						)
					),
					catchError(err => of(EwaybillActions.confirmEwaybillReceipt2651Error(err))),
					startWith(DocumentActions.signDocument(blrapnDto.xml))
				),
			),
			catchError(err => of(EwaybillActions.confirmEwaybillResponseError(err)))
		))
	));

	public createEwaybillFromEwaybill$ = createEffect(() => this.actions$.pipe(
		ofType(EwaybillActions.createEwaybillFromEwaybill),
		switchMap((action) => this.actions$.pipe(
			ofType(DocumentsActions.createDocumentFromAnotherSuccess),
			map(action => EwaybillActions.createEwaybillFromEwaybillSuccess(action.newDocument as Ewaybill)),
			startWith(DocumentsActions.createDocumentFromAnother(action.params))
		)),
		catchError(e => of(EwaybillActions.createEwaybillFromEwaybillError(e)))
	));

	constructor(
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
		private router: Router,
	) { }
}
