import { Ewaybill, EwaybillReceived } from "@helper/abstraction/ewaybill";
import { createAction } from "@ngrx/store";
import { Consignee, ConsigneesParams } from "@helper/abstraction/consignee";
import { CurrenciesParams, Currency } from "@helper/abstraction/currency";
import { GeneralGLNsParams, GeneralGLN } from "@helper/abstraction/generalGLN";
import { LoadingPoint } from "@helper/abstraction/loading-points";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { ExtraFieldsParams, ExtraField, ProductExtraFieldsParams, ProductExtraField } from "@helper/abstraction/extra-fields";
import { UnitOfMeasuresParams, UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { EwaybillDocument } from "./ewaybill";
import { TypedStoragesParams } from "@helper/abstraction/storages";
import { CertificateParams, Certificate } from "@helper/abstraction/certificate";
import { HttpErrorResponse } from "@angular/common/http";
import { DocumentFromAnotherParams, MessageType } from "@helper/abstraction/documents";
import { DraftType } from "@helper/abstraction/draft";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";
import { Status } from "@helper/abstraction/status";

// -------------------ACTIONS WITH DOCUMENT-------------------
export const saveDocument = createAction(
	"[Ewaybill] Save Document",
	(payload: EwaybillDocument): { document: EwaybillDocument } => ({ document: payload })
);

export const saveTransportDocument = createAction(
	"[Ewaybill] Save Transport Document",
	(payload: EwaybillDocument): { document: EwaybillDocument } => ({ document: payload })
);

export const saveDocumentError = createAction(
	"[Ewaybill] Save Documents Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const setIdOfDocument = createAction(
	"[Ewaybill] Set ID Of Documents",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveDocumentSuccess = createAction(
	"[Ewaybill] Do Redirect",
	(payload: number): { id: number } => ({ id: payload })
);

export const getEwaybill = createAction(
	"[Ewaybill] Get Ewaybill",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const getEwaybillResponse = createAction(
	"[Ewaybill] Get Ewaybill Response",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const getSentEwaybill = createAction(
	"[Ewaybill] Get Sent Ewaybill",
);

export const getEwaybillDocument = createAction(
	"[Ewaybill] Get Ewaybill Document Ewaybill",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getEwaybillDocumentSuccess = createAction(
	"[Ewaybill] Get Ewaybill Document Success",
	(payload: Ewaybill): { ewaybill: Ewaybill } => ({ ewaybill: payload })
);

export const getEwaybillDocumentError = createAction(
	"[Ewaybill] Get Ewaybill Document Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const setValidationError = createAction(
	"[Ewaybill] Set Validation Error",
	(payload: HttpErrorResponse): { validationError: HttpErrorResponse } => ({ validationError: payload })
);

export const resetValidationError = createAction(
	"[Ewaybill] Reset Validation Error",
);

export const deleteEwaybill = createAction(
	"[Ewaybill] Delete Ewaybill",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const deleteEwaybillSuccess = createAction(
	"[Ewaybill] Delete Ewaybill Success"
);

export const deleteEwaybillError = createAction(
	"[Ewaybill] Delete Ewaybill Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const deleteEwaybillResponse = createAction(
	"[Ewaybill] Delete Ewaybill Response",
	(draftType: DraftType, draftId: string): { draftType: DraftType; draftId: string } => ({ draftType, draftId })
);

export const updateEwaybillResponse = createAction(
	"[Ewaybill] Update Ewaybill Reponse",
	(draftType: MessageType, ewaybillReponse: Ewaybill): { draftType: MessageType; ewaybillReponse: Ewaybill } => ({ draftType, ewaybillReponse })
);

export const updateEwaybillResponseSuccess = createAction(
	"[Ewaybill] Update Ewaybill Reponse Success"
);

export const updateEwaybillResponseFailed = createAction(
	"[Ewaybill] Update Ewaybill Reponse Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const setEwaybill = createAction(
	"[Ewaybill] Set Ewaybill",
	(payload: Ewaybill): { ewaybill: Ewaybill } => ({ ewaybill: payload })
);

export const initEwaybill = createAction(
	"[Ewaybill] Init Ewaybill"
);

export const resetEwaybill = createAction(
	"[Ewaybill] Reset Ewaybill",
	(): { ewaybill: undefined } => ({ ewaybill: undefined })
);

// -------------------ACTIONS WITH CURRENCY DICTIONARY-------------------
export const updateCurrenciesFilter = createAction(
	"[Ewaybill] Next Currency Filter",
	(payload: CurrenciesParams): { filter: CurrenciesParams } => ({ filter: payload })
);

export const resetCurrencies = createAction(
	"[Ewaybill] Reset Currencies",
	(): { currencies: undefined } => ({ currencies: undefined })
);

export const getCurrenciesSuccess = createAction(
	"[Ewaybill] Get Currency Success",
	(payload: Currency[]): { currencies: Currency[] } => ({ currencies: payload })
);

export const getCurrenciesError = createAction(
	"[Ewaybill] Get Currency Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH CONSIGNEE DICTIONARY-------------------
export const updateConsigneesFilter = createAction(
	"[Ewaybill] Next Consignee Filter",
	(payload: ConsigneesParams): { filter: ConsigneesParams } => ({ filter: payload })
);

export const resetConsignees = createAction(
	"[Ewaybill] Reset Consignees",
	(): { consignees: undefined } => ({ consignees: undefined })
);

export const getConsigneesSuccess = createAction(
	"[Ewaybill] Get Consignee Success",
	(payload: Consignee[]): { consignees: Consignee[] } => ({ consignees: payload })
);

export const getConsigneesError = createAction(
	"[Ewaybill] Get Consignee Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH GENERAL GLN DICTIONARY-------------------
export const updateGeneralGLNsFilter = createAction(
	"[Ewaybill] Next GeneralGLN Filter",
	(payload: GeneralGLNsParams): { filter: GeneralGLNsParams } => ({ filter: payload })
);

export const resetGeneralGLNs = createAction(
	"[Ewaybill] Reset General GLNs",
	(): { generalGLNs: undefined } => ({ generalGLNs: undefined })
);

export const getGeneralGLNsSuccess = createAction(
	"[Ewaybill] Get General GLN Success",
	(payload: GeneralGLN[]): { generalGLNs: GeneralGLN[] } => ({ generalGLNs: payload })
);

export const getGeneralGLNsError = createAction(
	"[Ewaybill] Get General GLN Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH LOADING POINTS DICTIONARY-------------------
export const updateLoadingPointsFilter = createAction(
	"[Ewaybill] Next Loading Points Filter",
	(payload: TypedStoragesParams): { filter: TypedStoragesParams } => ({ filter: payload })
);

export const resetLoadingPoints = createAction(
	"[Ewaybill] Reset Loading Points",
	(): { loadingPoints: undefined } => ({ loadingPoints: undefined })
);

export const getLoadingPointsSuccess = createAction(
	"[Ewaybill] Get Loading Point Success",
	(payload: LoadingPoint[]): { loadingPoints: LoadingPoint[] } => ({ loadingPoints: payload })
);

export const getLoadingPointsError = createAction(
	"[Ewaybill] Get Loading Point Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH UNLOADING POINTS DICTIONARY-------------------
export const updateUnloadingPointsFilter = createAction(
	"[Ewaybill] Next Unloading Points Filter",
	(payload: TypedStoragesParams): { filter: TypedStoragesParams } => ({ filter: payload })
);

export const resetUnloadingPoints = createAction(
	"[Ewaybill] Reset Unloading Points",
	(): { unloadingPoints: undefined } => ({ unloadingPoints: undefined })
);

export const getUnloadingPointsSuccess = createAction(
	"[Ewaybill] Get Unloading Point Success",
	(payload: UnloadingPoint[]): { unloadingPoints: UnloadingPoint[] } => ({ unloadingPoints: payload })
);

export const getUnloadingPointsError = createAction(
	"[Ewaybill] Get Unloading Point Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH EXTRA FIELDS DICTIONARY-------------------
export const updateExtraFieldsFilter = createAction(
	"[Ewaybill] Update Extra Fields Filter",
	(payload: ExtraFieldsParams): { filter: ExtraFieldsParams } => ({ filter: payload })
);

export const resetExtraFields = createAction(
	"[Ewaybill] Reset Extra Fields",
	(): { extraFields: undefined } => ({ extraFields: undefined })
);

export const getExtraFieldsSuccess = createAction(
	"[Ewaybill] Get Extra Field Success",
	(payload: ExtraField[]): { extraFields: ExtraField[] } => ({ extraFields: payload })
);

export const getExtraFieldsError = createAction(
	"[Ewaybill] Get Extra Field Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH UNIT OF MEASURES DICTIONARY-------------------
export const updateUnitOfMeasuresFilter = createAction(
	"[Ewaybill] Next Unit Of Measures Filter",
	(payload: UnitOfMeasuresParams): { filter: UnitOfMeasuresParams } => ({ filter: payload })
);

export const resetUnitOfMeasures = createAction(
	"[Ewaybill] Reset Unit Of Measures",
	(): { unitOfMeasures: undefined } => ({ unitOfMeasures: undefined })
);

export const getUnitOfMeasuresSuccess = createAction(
	"[Ewaybill] Get Unit Of Measures Success",
	(payload: UnitOfMeasure[]): { unitOfMeasures: UnitOfMeasure[] } => ({ unitOfMeasures: payload })
);

export const getUnitOfMeasuresError = createAction(
	"[Ewaybill] Get Unit Of Measures Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH COUNTRIES DICTIONARY-------------------
export const updateCountriesFilter = createAction(
	"[Ewaybill] Next Countries Filter",
	(payload: CountriesParams): { filter: CountriesParams } => ({ filter: payload })
);

export const resetCountries = createAction(
	"[Ewaybill] Reset Countries",
	(): { countries: undefined } => ({ countries: undefined })
);

export const getCountriesSuccess = createAction(
	"[Ewaybill] Get Countries Success",
	(payload: Country[]): { countries: Country[] } => ({ countries: payload })
);

export const getCountriesError = createAction(
	"[Ewaybill] Get Countries Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH DOCUMENT TYPES DICTIONARY-------------------
export const updateDocumentTypesFilter = createAction(
	"[Ewaybill] Update Document Types Filter",
	(payload: CertificateParams): { filter: CertificateParams } => ({ filter: payload })
);

export const resetDocumentTypes = createAction(
	"[Ewaybill] Reset Document Types",
	(): { documentTypes: undefined } => ({ documentTypes: undefined })
);

export const getDocumentTypesSuccess = createAction(
	"[Ewaybill] Get Document Types Success",
	(payload: Certificate[]): { documentTypes: Certificate[] } => ({ documentTypes: payload })
);

export const getDocumentTypesError = createAction(
	"[Ewaybill] Get Document Types Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH EXTRA FIELD OF PRODUCT DICTIONARY-------------------
export const updateProductExtraFieldsFilter = createAction(
	"[Ewaybill] Next Product Extra Fields Filter",
	(payload: ProductExtraFieldsParams): { filter: ProductExtraFieldsParams } => ({ filter: payload })
);

export const resetProductExtraFields = createAction(
	"[Ewaybill] Reset Product Extra Fields",
	(): { productExtraFields: undefined } => ({ productExtraFields: undefined })
);

export const getProductExtraFieldsSuccess = createAction(
	"[Ewaybill] Get Product Extra Fields Success",
	(payload: ProductExtraField[]): { productExtraFields: ProductExtraField[] } => ({ productExtraFields: payload })
);

export const getProductExtraFieldsError = createAction(
	"[Ewaybill] Get Product Extra Fields Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const saveSignedEwaybillDraftSuccess = createAction(
	"[Ewaybill] Save Signed Ewaybill Draft Success",
);

export const createEwaybillDraftThenSign = createAction(
	"[Ewaybill] Create Ewaybill Draft Then Sign"
);

export const signingEwaybillDocumentError = createAction(
	"[Ewaybill] Signing Ewaybill Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

export const getEwaybillDraftNumberSuccess = createAction(
	"[Ewaybill] Get Ewaybill Draft Number Success",
	(payload: string): { ewaybillDraftNumber: string } => ({ ewaybillDraftNumber: payload })
);

export const sendSignedEwaybillDraft = createAction(
	"[Ewaybill] Send Ewaybill Ewaybill Draft",
	(payload: { draftType: DraftType; draftId: string }): { draftType: DraftType; draftId: string } => ({ ...payload })
);

export const sendSignedEwaybillDraftSuccess = createAction(
	"[Ewaybill] Send Ewaybill Ewaybill Draft Success"
);

export const sendSignedEwaybillDraftError = createAction(
	"[Ewaybill] Send Ewaybill Ewaybill Draft Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

// ------------------- ACTIONS WITH RECEIVED EWAYBILL -------------------

export const processReceivedEwaybill = createAction(
	"[Ewaybill] Process Received Ewaybill",
	(payload: { responseId: string; documentType: string }): { docInfo: { responseId: string; documentType: string } } => ({ docInfo: payload })
);

export const processReceivedEwaybillSuccess = createAction(
	"[Ewaybill] Process Received Ewaybill Success",
	(payload: { responseId: number; documentType: string; status: Status }): { docInfo: { responseId: number; documentType: string; status: Status } } => ({ docInfo: payload })
);

export const processReceivedEwaybillError = createAction(
	"[Ewaybill] Process Received Ewaybill Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const getReceivedEwaybill = createAction(
	"[Ewaybill] Get Received Ewaybill",
	(payload: { documentId: string; documentType: MessageType }): { docInfo: { documentId: string; documentType: string } } => ({ docInfo: payload })
);

export const getReceivedEwaybillSuccess = createAction(
	"[Ewaybill] Get Received Ewaybill Success",
	(payload: EwaybillReceived): { ewaybillReceived: EwaybillReceived } => ({ ewaybillReceived: payload })
);

export const getReceivedEwaybillError = createAction(
	"[Ewaybill] Get Received Ewaybill Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const resetEwaybillReceived = createAction(
	"[Ewaybill] Reset Received Ewaybill",
	(): { ewaybillReceived: undefined } => ({ ewaybillReceived: undefined })
);

// ------------------- ACTIONS WITH RESPONSE EWAYBILL DRAFT -------------------

export const getResponseEwaybillDraft = createAction(
	"[Ewaybill] Get Response Ewaybill Draft",
	(payload: { documentId: string; documentType: string }): { docInfo: { documentId: string; documentType: string } } => ({ docInfo: payload })
);

export const getResponseEwaybillDraftSuccess = createAction(
	"[Ewaybill] Get Response Ewaybill Draft Success",
	(payload: any): { ewaybillResponseDraft: any } => ({ ewaybillResponseDraft: payload })
);

export const getResponseEwaybillDraftError = createAction(
	"[Ewaybill] Get Response Ewaybill Draft Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const resetResponseEwaybillDraft = createAction(
	"[Ewaybill] Reset Response Ewaybill Draft",
	(): { ewaybillResponseDraft: undefined } => ({ ewaybillResponseDraft: undefined })
);
// -------------------ACTIONS WITH CHECKING SIGN IN EWAYBILL-------------------
export const checkSign = createAction(
	"[Ewaybill] Check Sign",
	(payload: { documentType: DraftType; documentId: string }): { params: { documentType: DraftType; documentId: string } } => ({ params: payload })
);

export const checkSignSuccess = createAction(
	"[Ewaybill] Check Sign Success",
	(payload: boolean): { statusOfCheckSign: boolean } => ({ statusOfCheckSign: payload })
);

export const checkSignError = createAction(
	"[Ewaybill] Check Sign Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetStatusOfCheckSign = createAction(
	"[Ewaybill] Reset Status Of Check Sign",
	(): { statusOfCheckSign: undefined } => ({ statusOfCheckSign: undefined })
);


export const confirmEwaybillReceipt = createAction(
	"[Ewaybill] Confirm Receipt",
	(payload: number): { documentId: number } => ({ documentId: payload })
);

export const confirmEwaybillReceiptSuccess = createAction(
	"[Ewaybill] Confirm Ewaybill Receipt Success",
);

export const confirmEwaybillReceiptError = createAction(
	"[Ewaybill] Confirm Ewaybill Receipt Error",
	(payload: HttpErrorResponse): { errors: HttpErrorResponse } => ({ errors: payload })
);

export const confirmError = createAction(
	"[Ewaybill] Confirm  Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const resetConfirmError = createAction(
	"[Ewaybill] Reset  Error",
	(): { errors: undefined } => ({ errors: undefined })
);

export const signEwaybillThenSave = createAction(
	"[Ewaybill] Sign And Save Ewaybill",
	(payload: { documentId: string; changeReason: string }): { documentId: string; changeReason: string } => ({ ...payload })
);

//------------page: response-draft, button: edit then signd and send----------------------------------------------
export const createEwaybillThenSign = createAction(
	"[Ewaybill] Create Ewaybill Then Sign",
	(payload: { documentId: number; changeReason: string }): { documentId: number; changeReason: string } => ({ ...payload })
);

export const createBLRAPNByEwaybillError = createAction(
	"[Ewaybill] Create BLRAPN By Ewaybill Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const saveSignedBLRAPNSuccess = createAction(
	"[Ewaybill] Save Signed BLRAPN Success",
);

export const saveSignedBLRAPNError = createAction(
	"[Ewaybill] Save Signed BLRAPN Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const errorCreateEwaybillThenSign = createAction(
	"[Ewaybill] Error Create Ewaybill Then Sign",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

//------------page: response-draft, button: signing BLRWBR----------------------------------------------

export const findXmlThenSign = createAction(
	"[Ewaybill] Find Xml Then Sign",
	(payload: { messageType: MessageType; draftId: number }): { draft: { messageType: MessageType; draftId: number } } => ({ draft: payload })
);

export const validateAndSaveSignedSuccess = createAction(
	"[Ewaybill] Validate And Save Signed Success"
);

export const validateAndSaveSignedError = createAction(
	"[Ewaybill] Validate And Save Signed Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const findXmlError = createAction(
	"[Ewaybill] Find Xml Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const errorFindXmlThenSign = createAction(
	"[Ewaybill] Error Find Xml Then Sign",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const getProviderConfirmation = createAction(
	"[Ewaybill] Get Provider Confirmation",
	(payload: string): { id: string } => ({ id: payload })
);

export const getProviderConfirmationSuccess = createAction(
	"[Ewaybill] Get Provider Confirmation Success",
	(payload: OperationsConfirmByProvider): { providerConfirmation: OperationsConfirmByProvider } => ({ providerConfirmation: payload })
);

export const getProviderConfirmationError = createAction(
	"[Ewaybill] Get Provider Confirmation Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const confirmEwaybillReceipt2651 = createAction(
	"[Ewaybill] Confirm Ewaybill Receipt 2651",
	(payload: number): { documentId: number } => ({ documentId: payload })
);
export const confirmEwaybillReceipt2651Success = createAction(
	"[Ewaybill] Confirm Ewaybill Receipt 2651 Success",
);

export const confirmEwaybillReceipt2651Error = createAction(
	"[Ewaybill] Confirm Ewaybill Receipt 2651 Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const signEwaybillDraft = createAction(
	"[Ewaybill] Try Sign Ewaybill Draft",
	(payload: string): { draftId: number } => ({ draftId: +payload })
);

export const confirmEwaybillResponse = createAction(
	"[Ewaybill] Confirm Ewaybill Response",
	(payload: number): { responseId: number } => ({ responseId: payload })
);

export const confirmEwaybillResponseSuccess = createAction(
	"[Ewaybill] Confirm Ewaybill Response Success"
	// (payload: number): { documentId: number } => ({ documentId: payload })
);

export const confirmEwaybillResponseError = createAction(
	"[Ewaybill] Confirm Ewaybill Response Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const updateResponseExtraFieldsFilter = createAction(
	"[Ewaybill] Next Response Extra Fields Filter",
	(payload: ExtraFieldsParams): { filter: ExtraFieldsParams } => ({ filter: payload })
);

export const resetResponseExtraFields = createAction(
	"[Ewaybill] Reset Response Extra Fields",
	(): { extraFields: undefined } => ({ extraFields: undefined })
);

export const getResponseExtraFieldsSuccess = createAction(
	"[Ewaybill] Get Response Extra Field Success",
	(payload: ExtraField[]): { extraFields: ExtraField[] } => ({ extraFields: payload })
);

export const getResponseExtraFieldsError = createAction(
	"[Ewaybill] Get Response Extra Field Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const createEwaybillFromEwaybill = createAction(
	"[Ewaybill] Create Ewaybill From Ewaybill",
	(payload: DocumentFromAnotherParams): { params: DocumentFromAnotherParams } => ({ params: payload })
);

export const createEwaybillFromEwaybillSuccess = createAction(
	"[Ewaybill] Create Ewaybill From Ewaybill Success",
	(payload: Ewaybill): { newDocument: Ewaybill } => ({ newDocument: payload })
);

export const createEwaybillFromEwaybillError = createAction(
	"[Ewaybill] Create Ewaybill From Ewaybill Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
