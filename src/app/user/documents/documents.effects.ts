import { from, Observable, of, throwError, zip } from "rxjs";
import {
	catchError,
	debounceTime,
	exhaustMap,
	filter,
	map,
	startWith,
	switchMap,
	take,
	tap
} from "rxjs/operators";

import { Injectable } from "@angular/core";
import { DocumentPropertiesUtil } from "@helper/document-properties-util";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";

import { UserBackendService } from "../user-core/user-backend.service";
import * as DocumentsActions from "./documents.actions";
import {
	createDocumentFromAnotherError,
	createDocumentFromAnotherSuccess
} from "./documents.actions";
import { DocumentsFilter } from "./document-filter/document-filter";
import { UserPermissionService } from "../user-core/user-permission.service";
import { Draft } from "./draft";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { notNull } from "@helper/operators";
import { DocumentsState } from "@app/user/documents/documents.reducer";

@Injectable()
export class DocumentsEffects {
	public resetDocumentFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.resetDocumentFilter),
		switchMap((action): Observable<Action> => {
			const draftTypes = this.userPermissionService.getDraftTypes(action.documentTypeId);

			const isIn$ = this.userPermissionService.checkPermission$(...draftTypes.map(dt => dt + "_IN")).pipe(take(1));
			const isOut$ = this.userPermissionService.checkPermission$(...draftTypes.map(dt => dt + "_OUT")).pipe(take(1));

			const docState$: Observable<[boolean, boolean]> = zip(isIn$, isOut$);

			return action.filter
				? of(DocumentsActions.updateDocumentsFilter(action.filter))
				: docState$.pipe(map(([isIn, isOut]) => {
					const filter = new DocumentsFilter({
						documentTypeId: action.documentTypeId,
						documentStage: "ALL",
						documentState: isIn ? "INCOMING" : isOut ? "OUTGOING" : "DRAFT"
					});
					return DocumentsActions.updateDocumentsFilter(filter);
				}));
		})
	));

	// роутит на первый
	public setDescriptionDocumentTypes$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.setDescriptionDocumentTypes),
		filter(dts => !!dts.documentTypes.length),
		map(({ documentTypes }): Action => DocumentsActions.switchDocumentType(documentTypes[0].id))
	));

	public getDocuments$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.getDocuments),
		exhaustMap((action): Observable<Action> => this.backendService.documents.list.get$(action.documentsParams).pipe(
			map((documents): Action => DocumentsActions.getDocumentsSuccess(documents)),
			catchError((error): Observable<Action> => of(DocumentsActions.getDocumentsError(error)))
		))
	));

	public updateDocumentsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.updateDocumentsFilter),
		debounceTime(300),
		map(({ filter }): Action => DocumentsActions.getDocuments(filter))
	));

	public updatePartnertsFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.updatePartnersFilter),
		exhaustMap((action): Observable<Action> => this.backendService.organization.partners.list.get$(action.filter).pipe(
			map((partners): Action => DocumentsActions.getPartnersSuccess(partners)),
			catchError((error): Observable<Action> => of(DocumentsActions.getPartnersError(error)))
		))
	));

	public updateStoragesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.updateStoragesFilter),
		exhaustMap((action): Observable<Action> => this.backendService.organization.storages.list.get$(action.filter).pipe(
			map((storages): Action => DocumentsActions.getStoragesSuccess(storages)),
			catchError((error): Observable<Action> => of(DocumentsActions.getStoragesError(error)))
		))
	));

	public updateStatusesFilter$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.updateStatusesFilter),
		exhaustMap((action): Observable<Action> => this.backendService.documents.processingStatuses.list.get$(action.filter.documentTypeId).pipe(
			map((statuses): Action => DocumentsActions.getStatusesSuccess(statuses)),
			catchError((error): Observable<Action> => of(DocumentsActions.getStatusesError(error)))
		))
	));
	public switchDocumentType$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.switchDocumentType),
		tap(action => {

			const messageType = this.userPermissionService.documentTypeToDraftMap[action.documentTypeId][0];
			this.userPermissionService.getDescriptionDocumentType$(messageType).pipe(
				take(1),
				notNull()
			).subscribe(dt => {
				this.title.setTitle(dt.name);
			});
		}),
		switchMap((action): Observable<Action> => of(
			DocumentsActions.switchDocumentProperties(action.documentTypeId),
			DocumentsActions.resetDocumentFilter(action.documentTypeId, action.filter)
		))
	));
	public createXlsx$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createXlsx),
		exhaustMap((action): Observable<Action> => this.backendService.formatDocument.create.xlsx.post$(action.export).pipe(
			map((): Action => DocumentsActions.createXlsxSuccess()),
			catchError((error): Observable<Action> => of(DocumentsActions.createXlsxError(error)))
		))
	));

	// public getDocument$ = createEffect((): Observable<Action> => this.actions$.pipe(
	// 	ofType(DocumentsActions.getDocument),
	// 	exhaustMap((action): Observable<Action> => this.backendService.documents.document.get$(action.document.documentTypeId, action.document.documentId).pipe(
	// 		map((document: Document): Action => DocumentsActions.getDocumentSuccess(document)),
	// 		catchError((error): Observable<Action> => of(DocumentsActions.getDocumentFailed(error)))
	// 	))
	// ));
	public createXml$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createXml),
		exhaustMap((action): Observable<Action> => this.backendService.formatDocument.create.xml.post$(action.export).pipe(
			map((): Action => DocumentsActions.createXmlSuccess()),
			catchError((error): Observable<Action> => of(DocumentsActions.createXmlFailed(error)))
		))
	));
	public createWithValidation$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createWithValidation),
		exhaustMap((action): Observable<Action> => this.backendService.draft.createWithValidation.post$(action.draftType, action.document).pipe(
			map(draftDto =>
				DocumentsActions.creatingWithValidationSuccess(
					new Draft(draftDto.id.toString(), action.draftType, action.document, draftDto.xmlBody)
				)
			),
			catchError(error => of(DocumentsActions.creatingWithValidationError(error)))
		))
	));
	public createWithValidationNewApi$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createWithValidationNewApi),
		exhaustMap((action): Observable<Action> => {
			return this.backendService.documents.createWithValidation.post$(action.draftType, action.document).pipe(
				map(draftDto =>
					DocumentsActions.creatingWithValidationSuccess(
						new Draft(draftDto.id.toString(), action.draftType, action.document, draftDto.xmlBody)
					)
				),
				catchError(error => of(DocumentsActions.creatingWithValidationError(error)))
			);
		})
	));
	public signDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.signDraft),
		exhaustMap((action): Observable<Action> => {
			if (!action.draft.xmlString || !action.draft.draftType) {
				return throwError("No xmlString or draftType");
			}
			return this.backendService.signing.post$(action.draft.xmlString, new Date()).pipe(
				map(signedDraftDto => ({
					documentId: action.draft.documentId,
					xmlString: signedDraftDto.signedXml,
					draftType: action.draft.draftType!, // eslint-disable-line
					time: action.draft.time || new Date(),
					document: action.draft.document
				})),
				map(signedDraft => DocumentsActions.signingDraftSuccess(signedDraft, action.withoutSave)),
				catchError(error => of(DocumentsActions.signingDraftError({ error, id: action.draft.documentId })))
			);
		}),
	));
	public createDraftThenSign$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createDraftThenSign),
		switchMap((action) =>
			this.actions$.pipe(
				ofType(DocumentsActions.creatingWithValidationSuccess),
				take(1),
				map(creatingAction => DocumentsActions.signDraft(creatingAction.draft)),
				startWith(DocumentsActions.createWithValidation({
					document: action.document,
					draftType: action.draftType
				})),
			)
		)
	));
	public createDraftThenSignNewApi$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createDraftThenSignNewApi),
		switchMap((action) =>
			this.actions$.pipe(
				ofType(DocumentsActions.creatingWithValidationSuccess),
				take(1),
				map(creatingAction => DocumentsActions.signDraft(creatingAction.draft)),
				startWith(DocumentsActions.createWithValidationNewApi({
					document: action.document,
					draftType: action.draftType
				})),
			)
		)
	));
	public saveSignedDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.saveSignedDraft),
		exhaustMap((action) => this.backendService.documents.saveSigned.post$(
			action.draft.draftType,
			{
				id: action.draft.documentId,
				xmlBody: action.draft.xmlString
			}
		).pipe(
			switchMap(() => of(DocumentsActions.saveSignedDraftSuccess(action.draft))),
			catchError(error => of(DocumentsActions.saveSignedDraftError(error)))
		)
		)
	));
	public openSignedDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.openSignedDraft),
		switchMap(action =>
			from(
				this.router.navigate(["user", "documents", this.userPermissionService.getDocumentType(action.signedDraft.draftType), "sign-draft", action.signedDraft.draftType, action.signedDraft.documentId])
			).pipe(
				map(() => DocumentsActions.openSignedDraftSuccess())
			)
		),
		catchError(error => of(DocumentsActions.openSignedDraftError(error)))
	));
	public getDocumentDraftNumber$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.getDraftNumber),
		exhaustMap(() => this.backendService.ewaybill.uniqueNumber.get$().pipe(
			map(dto => DocumentsActions.getDraftNumberSuccess(dto.uniqueNumber))
		))
	));
	public getEinvoiceDraftNumber$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.getEinvoiceDraftNumber),
		exhaustMap(() => this.backendService.einvoice.uniqueNumber.get$().pipe(
			map(dto => DocumentsActions.getEinvoiceDraftNumberSuccess(dto.uniqueNumber))
		))
	));
	public signDocument$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.signDocument),
		exhaustMap((action): Observable<Action> =>
			this.backendService.signing.post$(action.documentXml, new Date()).pipe(
				map(signedXml => DocumentsActions.signDocumentSuccess(signedXml)),
				catchError(error => of(DocumentsActions.signDocumentError(error)))
			)
		),
	));
	public sendDraft$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.sendDraft),
		exhaustMap((action) => this.backendService.activemq.send.get$(action.draftId, action.draftType).pipe(
			map(() => DocumentsActions.sendDraftSuccess()),
			catchError(error => of(DocumentsActions.sendDraftError(error)))
		))
	));
	public createDocumentFromAnother = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.createDocumentFromAnother),
		exhaustMap(action => this.backendService.ewaybill.getDocumentFromAnother.post$(action.params).pipe(
			map((dto) => createDocumentFromAnotherSuccess(dto)),
			catchError(error => of(createDocumentFromAnotherError(error)))
		))
	));

	public switchDocumentProperties$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.switchDocumentProperties),
		map((action): Action => DocumentsActions.setDocumentProperties(this.documentProperties.getProperties(action.documentTypeId)))
	));

	public sendMassEwaybill = createEffect(() => this.actions$.pipe(
		ofType(DocumentsActions.sendMassDocument),
		exhaustMap(action => this.backendService.ewaybill.sendMass.post$(action.ids).pipe(
			map(report => DocumentsActions.sendMassDocumentSuccess(report)),
			catchError(error => of(DocumentsActions.sendMassDocumentError(error)))
		))
	));

	public importEinvoice$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(DocumentsActions.importEinvoice),
		switchMap(action => this.backendService.import.post$(action.documentType, action.file).pipe(
			map(() => DocumentsActions.importEinvoiceSuccess),
			catchError(error => of(DocumentsActions.importEinvoiceError(error)))
		))
	));

	private readonly documentProperties = DocumentPropertiesUtil;

	constructor(
		private readonly title: Title,
		private readonly router: Router,
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
		private readonly userPermissionService: UserPermissionService,
		private readonly store: Store<DocumentsState>
	) { }
}
