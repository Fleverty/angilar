import {
	Document,
	DocumentProperty,
	DocumentsParams,
	DocumentType,
	ExportDocument,
	DescriptionDocumentType,
	DocumentKind,
	DocumentFromAnotherParams,
	MassSendReport
} from "@helper/abstraction/documents";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { Storage, StoragesParams } from "@helper/abstraction/storages";
import { createAction } from "@ngrx/store";
import { Draft, SignedDraft, DraftType, SignedDraftDto } from "@helper/abstraction/draft";
import { HttpErrorResponse } from "@angular/common/http";
import { StatusesParams, Status } from "@helper/abstraction/status";

export const initDocumentsPage = createAction("[Documents] Init");

export const resetDocumentsPage = createAction("[Documents] Reset");

export const getDocumentsTypes = createAction("[Documents] Load Documents Types");

export const getDocumentsTypesError = createAction(
	"[Documents] Load Documents Types Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getDocumentsTypesSuccess = createAction(
	"[Documents] Load Documents Types Success",
	(payload: DocumentType[]): { documentTypes: DocumentType[] } => ({ documentTypes: payload })
);

export const switchDocumentType = createAction(
	"[Document] Switch Document Type",
	(documentTypeId: DocumentType, filter?: DocumentsParams): { documentTypeId: DocumentType; filter?: DocumentsParams } => ({ documentTypeId, filter })
);

export const switchDocumentProperties = createAction(
	"[Document] Switch Document Properties",
	(payload: string): { documentTypeId: string } => ({ documentTypeId: payload })
);

export const setDocumentProperties = createAction(
	"[Documents] Set Documents Properties",
	(payload: DocumentProperty[]): { currentDocumentProperty: DocumentProperty[] } => ({ currentDocumentProperty: payload })
);

export const getDocuments = createAction(
	"[Documents] Get Documents",
	(payload: DocumentsParams): { documentsParams: DocumentsParams } => ({ documentsParams: payload }));

export const getDocumentsSuccess = createAction(
	"[Documents] Get Documents Success",
	(payload: Document[]): { documents: Document[] } => ({ documents: payload })
);

export const getDocumentsError = createAction(
	"[Documents] Get Documents Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const updateDocumentsFilter = createAction(
	"[Documents] Update Documents Filter",
	(payload: DocumentsParams): { filter: DocumentsParams } => ({ filter: payload })
);

export const resetDocumentFilter = createAction(
	"[Documents] Reset Document Filter",
	(documentTypeId: DocumentType, filter?: DocumentsParams): { documentTypeId: DocumentType; filter?: DocumentsParams } => ({ documentTypeId, filter })
);

export const resetDocuments = createAction(
	"[Documents] Reset Documents",
	(): { documents: undefined } => ({ documents: undefined })
);

export const selectDocuments = createAction(
	"[Documents] Select Document",
	(payload: Document[]): { selectedDocuments: Document[] } => ({ selectedDocuments: payload })
);

export const resetSelectedDocuments = createAction(
	"[Documents] Reset Select Document",
	(): { selectedDocuments: undefined } => ({ selectedDocuments: undefined })
);

export const updatePartnersFilter = createAction(
	"[Documents] Next Partner Filter",
	(payload: PartnersParams): { filter: PartnersParams } => ({ filter: payload })
);

export const resetPartners = createAction(
	"[Documents] Reset Partners",
	(): { partners: undefined } => ({ partners: undefined })
);

export const getPartners = createAction(
	"[Documents] Get Partners",
	(payload: PartnersParams): { partnerParams: PartnersParams } => ({ partnerParams: payload })
);

export const getPartnersSuccess = createAction(
	"[Documents] Get Partner Success",
	(payload: Partner[]): { partners: Partner[] } => ({ partners: payload })
);

export const getPartnersError = createAction(
	"[Documents] Get Partner Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const updateStoragesFilter = createAction(
	"[Documents] Next Storages Filter",
	(payload: StoragesParams): { filter: StoragesParams } => ({ filter: payload })
);

export const resetStorages = createAction(
	"[Documents] Reset Storages",
	(): { storages: undefined } => ({ storages: undefined })
);

export const getStorages = createAction(
	"[Documents] Get Storages",
	(payload: StoragesParams): { storagesParams: StoragesParams } => ({ storagesParams: payload })
);

export const getStoragesSuccess = createAction(
	"[Documents] Get Storages Success",
	(payload: Storage[]): { storages: Storage[] } => ({ storages: payload })
);

export const getStoragesError = createAction(
	"[Documents] Get Storages Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const updateStatusesFilter = createAction(
	"[Documents] Next Statuses Filter",
	(payload: StatusesParams): { filter: StatusesParams } => ({ filter: payload })
);

export const resetStatuses = createAction(
	"[Documents] Reset Statuses",
	(): { statuses: undefined } => ({ statuses: undefined })
);

export const getStatuses = createAction(
	"[Documents] Get Statuses",
	(payload: StatusesParams): { statusesParams: StatusesParams } => ({ statusesParams: payload })
);

export const getStatusesSuccess = createAction(
	"[Documents] Get Statuses Success",
	(payload: Status[]): { statuses: Status[] } => ({ statuses: payload })
);

export const getStatusesError = createAction(
	"[Documents] Get Statuses Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const setDescriptionDocumentTypes = createAction(
	"[Documents] Set Description Document Types",
	(payload: DescriptionDocumentType[]): { documentTypes: DescriptionDocumentType[] } => ({ documentTypes: payload })
);

export const openDocument = createAction(
	"[Documents] Open Document",
	(payload: Document | undefined): { document: Document | undefined } => ({ document: payload })
);

export const openSignedDraft = createAction(
	"[Documents] Open Signed Draft",
	(payload: SignedDraft<DocumentKind>): { signedDraft: SignedDraft<DocumentKind> } => ({ signedDraft: payload })
);

export const openSignedDraftSuccess = createAction(
	"[Documents] Open Signed Draft Success"
);

export const openSignedDraftError = createAction(
	"[Documents] Open Signed Draft Error",
	(...payload: Error[]): { errors: Error[] } => ({ errors: payload })
);

export const clearOpenedDraft = createAction(
	"[Documents] Clear Opened Draft"
);

export const getDocument = createAction(
	"[Documents] Get Document",
	(payload: { documentTypeId: string; documentId: number }): { document: { documentTypeId: string; documentId: number } } => ({ document: payload })
);

export const getDocumentSuccess = createAction(
	"[Documents] Get Document Success",
	(payload: Document): { document: Document } => ({ document: payload })
);

export const getDocumentFailed = createAction(
	"[Documents] Get Document Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const pushSelectedItems = createAction(
	"[Documents] Push Select Items",
	(payload: Document[]): { selectedItems: Document[] } => ({ selectedItems: payload })
);

export const resetSelectedItems = createAction("[Documents] Reset Select Items");

export const createXlsx = createAction(
	"[Documents] Create Xlsx",
	(payload: ExportDocument): { export: ExportDocument } => ({ export: payload })
);

export const createXlsxSuccess = createAction("[Documents] Create Xlsx Success");

export const createXlsxError = createAction(
	"[Documents] Create Xlsx Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const createXml = createAction(
	"[Documents] Create Xml",
	(payload: ExportDocument): { export: ExportDocument } => ({ export: payload }));

export const createXmlSuccess = createAction("[Documents] Create Xml Success");

export const createXmlFailed = createAction(
	"[Documents] Create Xml Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const signDraft = createAction(
	"[Documents] Try Sign Draft",
	(payload: Draft<DocumentKind>, isOpenSigned = true, withoutSave = false): { draft: Draft<DocumentKind>; isOpenSigned: boolean; withoutSave: boolean } => ({ draft: payload, isOpenSigned, withoutSave })
);

export const signDocument = createAction(
	"[Documents] Sign Document",
	(payload: string): { documentXml: string } => ({ documentXml: payload })
);

export const signDocumentSuccess = createAction(
	"[Documents] Sign Document Success",
	(payload: SignedDraftDto): { signedDocument: SignedDraftDto } => ({ signedDocument: payload })
);

export const signDocumentError = createAction(
	"[Documents] Sign Document Error",
	(payload: Error): { errors: Error } => ({ errors: payload })
);

export const signingDraftSuccess = createAction(
	"[Documents] Signing Draft Success",
	(payload: SignedDraft<DocumentKind>, withoutSave = false): { draft: SignedDraft<DocumentKind>; withoutSave: boolean } => ({ draft: payload, withoutSave })
);

export const signingDraftError = createAction(
	"[Documents] Signing Draft Errors",
	(payload: { error: Error; id: string }): { error: Error; id: string } => ({ error: payload.error, id: payload.id })
);

export const createWithValidation = createAction(
	"[Documents] Create Document With Validation",
	(payload: { document: DocumentKind; draftType: DraftType }): { document: DocumentKind; draftType: DraftType } => ({ ...payload })
);

export const createWithValidationNewApi = createAction(
	"[Documents-new] Create Document With Validation",
	(payload: { document: DocumentKind; draftType: DraftType }): { document: DocumentKind; draftType: DraftType } => ({ ...payload })
);

export const ewaybillSaveValidationError = createAction(
	"[Documents] Ewaybill Save Validation Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const einvoiceSaveValidationError = createAction(
	"[Documents] Einvoice Save Validation Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const creatingWithValidationSuccess = createAction(
	"[Documents] Creating Document With Validation Success",
	(payload: Draft<DocumentKind>): { draft: Draft<DocumentKind> } => ({ draft: payload })
);

export const creatingWithValidationError = createAction(
	"[Documents] Creating Document With Validation Errors",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const createDraftThenSign = createAction(
	"[Documents] Create Document Draft Then Sign",
	(payload: { document: DocumentKind; draftType: DraftType }): { document: DocumentKind; draftType: DraftType } => ({ ...payload })
);

export const createDraftThenSignNewApi = createAction(
	"[Documents] Create Documents Draft Then Sign",
	(payload: { document: DocumentKind; draftType: DraftType }): { document: DocumentKind; draftType: DraftType } => ({ ...payload })
);

export const saveSignedDraft = createAction(
	"[Documents] Save Signed Draft",
	<T extends DocumentKind>(payload: SignedDraft<T>): { draft: SignedDraft<T> } => ({ draft: payload })
);

export const saveSignedDraftSuccess = createAction(
	"[Documents] Save Signed Draft Success",
	<T extends DocumentKind>(payload: SignedDraft<T>): { signedDraft: SignedDraft<T> } => ({ signedDraft: payload })
);

export const saveSignedDraftError = createAction(
	"[Documents] Save Signed Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getDraftNumber = createAction(
	"[Documents] Get Draft Number",
	(payload: DraftType): { draftType: DraftType } => ({ draftType: payload })
);

export const getDraftNumberSuccess = createAction(
	"[Documents] Get Draft Number Success",
	(payload: string): { documentDraftNumber: string } => ({ documentDraftNumber: payload })
);

export const getEinvoiceDraftNumber = createAction(
	"[Documents] Get Einvoice Draft Number",
	(payload: DraftType): { draftType: DraftType } => ({ draftType: payload })
);

export const getEinvoiceDraftNumberSuccess = createAction(
	"[Documents] Get Einvoice Draft Number Success",
	(payload: string): { documentDraftNumber: string } => ({ documentDraftNumber: payload })
);

export const sendDraft = createAction(
	"[Documents] Send Draft",
	(payload: { draftType: DraftType; draftId: string }): { draftType: DraftType; draftId: string } => ({ ...payload })
);

export const sendDraftSuccess = createAction(
	"[Documents] Send Draft Success"
);

export const sendDraftError = createAction(
	"[Documents] Send Draft Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const createDocumentFromAnother = createAction(
	"[Documents] Create Document From Another",
	(payload: DocumentFromAnotherParams): { params: DocumentFromAnotherParams } => ({ params: payload })
);

export const createDocumentFromAnotherSuccess = createAction(
	"[Documents] Create Document From Another Success",
	(payload: DocumentKind): { newDocument: DocumentKind } => ({ newDocument: payload })
);

export const createDocumentFromAnotherError = createAction(
	"[Documents] Create Document From Another Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

export const setLastOpenedDocumentId = createAction(
	"[Documents] Set Last Opened Document Id",
	(payload: number): { lastOpenedDocumentId: number } => ({ lastOpenedDocumentId: payload })
);

export const sendMassDocument = createAction(
	"[Documents] Send Mass Ewaybill",
	(payload: string[]): { ids: string[] } => ({ ids: payload })
);

export const sendMassDocumentSuccess = createAction(
	"[Documents] Send Mass Document Success",
	(payload: MassSendReport): { report: MassSendReport } => ({ report: payload })
);

export const sendMassDocumentError = createAction(
	"[Documents] Send Mass Document Error",
	(payload: HttpErrorResponse ): { error: HttpErrorResponse } => ({ error: payload })
);

export const clearMassSendReport = createAction(
	"[Documents] CLear Mass Send Report",
);

export const importEinvoice = createAction(
	"[Documents] Import Einvoice",
	(payload: { documentType: DocumentType; file: File }): { documentType: DocumentType; file: File } => ({ ...payload })
);

export const importEinvoiceSuccess = createAction("[Documents] Import Einvoice Success");

export const importEinvoiceError = createAction(
	"[Documents] Import Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
