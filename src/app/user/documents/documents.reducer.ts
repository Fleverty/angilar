import {
	Document,
	DocumentProperty,
	DocumentType,
	DocumentsParams, DocumentKind, MassSendReport
} from "@helper/abstraction/documents";
import { Partner } from "@helper/abstraction/partners";
import { Storage } from "@helper/abstraction/storages";
import { Action, createReducer, on } from "@ngrx/store";

import * as DocumentsActions from "./documents.actions";
import { Status } from "@helper/abstraction/status";
import { Draft } from "@helper/abstraction/draft";

export interface DocumentsState {
	signingDraftProcess?: Draft<DocumentKind>;
	documentTypes: DocumentType[];
	documents?: Document[];
	currentDocumentProperty: DocumentProperty[];
	selectedDocuments?: Document[];
	partners?: Partner[];
	storages?: Storage[];
	statuses?: Status[];
	currentDocumentTypeId?: string;
	filter?: DocumentsParams;
	openedDocument?: Document;
	document?: Document;
	selectedItems?: Document[];
	lastOpenedDocumentId?: number;
	massSendReport?: MassSendReport;
}

export const initialState: DocumentsState = {
	documentTypes: [],
	documents: [],
	currentDocumentProperty: [],
};

const documentsReducer = createReducer(
	initialState,
	on(DocumentsActions.resetDocumentsPage, (): DocumentsState => ({
		documentTypes: [],
		documents: [],
		currentDocumentProperty: [],
		selectedDocuments: undefined
	})),
	on(DocumentsActions.switchDocumentType, (state, { documentTypeId }): DocumentsState => ({ ...state, currentDocumentTypeId: documentTypeId })),
	on(DocumentsActions.setDocumentProperties, (state, { currentDocumentProperty }): DocumentsState => ({ ...state, currentDocumentProperty })),
	on(DocumentsActions.getDocumentsTypesSuccess, (state, { documentTypes }): DocumentsState => ({ ...state, documentTypes })),
	on(DocumentsActions.getDocumentsSuccess, (state, { documents }): DocumentsState => ({ ...state, documents })),
	on(DocumentsActions.resetDocuments, (state, { documents }): DocumentsState => ({ ...state, documents })),
	on(DocumentsActions.resetPartners, (state, { partners }): DocumentsState => ({ ...state, partners })),
	on(DocumentsActions.resetStorages, (state, { storages }): DocumentsState => ({ ...state, storages })),
	on(DocumentsActions.resetStatuses, (state, { statuses }): DocumentsState => ({ ...state, statuses })),
	on(DocumentsActions.getPartnersSuccess, (state, { partners }): DocumentsState => ({ ...state, partners })),
	on(DocumentsActions.getStoragesSuccess, (state, { storages }): DocumentsState => ({ ...state, storages })),
	on(DocumentsActions.getStatusesSuccess, (state, { statuses }): DocumentsState => ({ ...state, statuses })),
	on(DocumentsActions.selectDocuments, (state, { selectedDocuments }): DocumentsState => ({ ...state, selectedDocuments })),
	on(DocumentsActions.resetSelectedDocuments, (state, { selectedDocuments }): DocumentsState => ({ ...state, selectedDocuments })),
	on(DocumentsActions.updateDocumentsFilter, (state, { filter }): DocumentsState => ({ ...state, filter })),
	on(DocumentsActions.openDocument, (state, { document }): DocumentsState => ({ ...state, openedDocument: document })),
	on(DocumentsActions.getDocumentSuccess, (state, { document }): DocumentsState => ({ ...state, document })),
	on(DocumentsActions.pushSelectedItems, (state, { selectedItems }): DocumentsState => ({ ...state, selectedItems })),
	on(DocumentsActions.resetSelectedItems, (state): DocumentsState => ({ ...state, selectedItems: undefined })),
	on(DocumentsActions.setLastOpenedDocumentId, (state, { lastOpenedDocumentId }): DocumentsState => ({ ...state, lastOpenedDocumentId })),
	on(DocumentsActions.creatingWithValidationSuccess, (state, { draft }): DocumentsState => ({ ...state, signingDraftProcess: draft })),
	on(DocumentsActions.signingDraftSuccess, (state): DocumentsState => ({ ...state, signingDraftProcess: undefined })),
	on(DocumentsActions.sendMassDocumentSuccess, (state, { report }): DocumentsState => ({ ...state, massSendReport: report })),
	on(DocumentsActions.clearMassSendReport, (state): DocumentsState => ({ ...state, massSendReport: undefined }))
);

export function reducer(state: DocumentsState | undefined, action: Action): DocumentsState {
	return documentsReducer(state, action);
}
