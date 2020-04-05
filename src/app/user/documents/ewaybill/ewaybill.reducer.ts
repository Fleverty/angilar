import { EwaybillProduct, Ewaybill, EwaybillReceived, EwaybillResponse } from "@helper/abstraction/ewaybill";
import { Action, createReducer, on } from "@ngrx/store";

import * as EwaybillActions from "./ewaybill.actions";
import * as EwaybillCancelActions from "./ewaybill-cancel/ewaybill-cancel.actions";
import { Currency } from "@helper/abstraction/currency";
import { Consignee } from "@helper/abstraction/consignee";
import { GeneralGLN } from "@helper/abstraction/generalGLN";
import { LoadingPoint } from "@helper/abstraction/loading-points";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { ExtraField, ProductExtraField } from "@helper/abstraction/extra-fields";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";
import { TotalSums } from "./ewaybill";
import { Certificate } from "@helper/abstraction/certificate";
import { HttpErrorResponse } from "@angular/common/http";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";

export interface EwaybillState {
	id?: number;
	products: EwaybillProduct[];
	ewaybill?: Ewaybill | EwaybillResponse;
	ewaybillReceived?: EwaybillReceived;
	ewaybillResponseDraft?: any;
	productForEdit?: EwaybillProduct;
	totalSums: TotalSums;
	isAutoSum: boolean;
	currencies?: Currency[];
	consignees?: Consignee[];
	generalGLNs?: GeneralGLN[];
	loadingPoints?: LoadingPoint[];
	unloadingPoints?: UnloadingPoint[];
	extraFields?: ExtraField[];
	responseExtraFields?: ExtraField[];
	unitOfMeasures?: UnitOfMeasure[];
	countries?: Country[];
	documentTypes?: Certificate[];
	productExtraFields?: ProductExtraField[];
	validationError?: HttpErrorResponse;
	signingError?: HttpErrorResponse | Error;
	signingStatus: "ERROR" | "PENDING" | "OK";
	ewaybillDraftNumber?: string;
	cancelingStatus?: "ERROR" | "PENDING" | "OK";
	cancelError?: HttpErrorResponse | Error;
	sendingError?: HttpErrorResponse | Error;
	confirmationError?: HttpErrorResponse | Error;
	statusOfCheckSign?: boolean;
	errorCreateEwaybillThenSign?: HttpErrorResponse | Error;
	errorFindXmlThenSign?: HttpErrorResponse | Error;
	providerConfirmation?: OperationsConfirmByProvider;
	confirmEwaybillReceipt2651Error?: HttpErrorResponse;
}

const initialState: EwaybillState = {
	products: [],
	totalSums: new TotalSums(),
	isAutoSum: true,
	currencies: [],
	consignees: [],
	generalGLNs: [],
	loadingPoints: [],
	unloadingPoints: [],
	extraFields: [],
	unitOfMeasures: [],
	countries: [],
	documentTypes: [],
	productExtraFields: [],
	responseExtraFields: [],
	signingStatus: "OK",
	cancelingStatus: undefined
};

const ewaybillReducer = createReducer(
	initialState,
	on(EwaybillActions.setEwaybill, (state, { ewaybill }): EwaybillState => ({ ...state, ewaybill })),
	on(EwaybillActions.resetEwaybill, (): EwaybillState => ({ ...initialState })),
	on(EwaybillActions.setIdOfDocument, (state, { id }): EwaybillState => ({ ...state, id })),
	on(EwaybillActions.getCurrenciesSuccess, (state, { currencies }): EwaybillState => ({ ...state, currencies })),
	on(EwaybillActions.resetCurrencies, (state, { currencies }): EwaybillState => ({ ...state, currencies })),
	on(EwaybillActions.getConsigneesSuccess, (state, { consignees }): EwaybillState => ({ ...state, consignees })),
	on(EwaybillActions.resetConsignees, (state, { consignees }): EwaybillState => ({ ...state, consignees })),
	on(EwaybillActions.getGeneralGLNsSuccess, (state, { generalGLNs }): EwaybillState => ({ ...state, generalGLNs })),
	on(EwaybillActions.resetGeneralGLNs, (state, { generalGLNs }): EwaybillState => ({ ...state, generalGLNs })),
	on(EwaybillActions.getLoadingPointsSuccess, (state, { loadingPoints }): EwaybillState => ({ ...state, loadingPoints })),
	on(EwaybillActions.resetLoadingPoints, (state, { loadingPoints }): EwaybillState => ({ ...state, loadingPoints })),
	on(EwaybillActions.getUnloadingPointsSuccess, (state, { unloadingPoints }): EwaybillState => ({ ...state, unloadingPoints })),
	on(EwaybillActions.resetUnloadingPoints, (state, { unloadingPoints }): EwaybillState => ({ ...state, unloadingPoints })),
	on(EwaybillActions.getExtraFieldsSuccess, (state, { extraFields }): EwaybillState => ({ ...state, extraFields })),
	on(EwaybillActions.resetExtraFields, (state, { extraFields }): EwaybillState => ({ ...state, extraFields })),
	on(EwaybillActions.getResponseExtraFieldsSuccess, (state, { extraFields }): EwaybillState => ({ ...state, responseExtraFields: extraFields })),
	on(EwaybillActions.resetResponseExtraFields, (state, { extraFields }): EwaybillState => ({ ...state, responseExtraFields: extraFields })),
	on(EwaybillActions.getUnitOfMeasuresSuccess, (state, { unitOfMeasures }): EwaybillState => ({ ...state, unitOfMeasures })),
	on(EwaybillActions.resetUnitOfMeasures, (state, { unitOfMeasures }): EwaybillState => ({ ...state, unitOfMeasures })),
	on(EwaybillActions.getCountriesSuccess, (state, { countries }): EwaybillState => ({ ...state, countries })),
	on(EwaybillActions.resetCountries, (state, { countries }): EwaybillState => ({ ...state, countries })),
	on(EwaybillActions.getDocumentTypesSuccess, (state, { documentTypes }): EwaybillState => ({ ...state, documentTypes })),
	on(EwaybillActions.resetDocumentTypes, (state, { documentTypes }): EwaybillState => ({ ...state, documentTypes })),
	on(EwaybillActions.getProductExtraFieldsSuccess, (state, { productExtraFields }): EwaybillState => ({ ...state, productExtraFields })),
	on(EwaybillActions.resetProductExtraFields, (state, { productExtraFields }): EwaybillState => ({ ...state, productExtraFields })),
	on(EwaybillActions.setValidationError, (state, { validationError }): EwaybillState => ({ ...state, validationError })),
	on(EwaybillActions.resetValidationError, (state): EwaybillState => ({ ...state, validationError: undefined })),
	on(EwaybillActions.signingEwaybillDocumentError, (state, { error }): EwaybillState => ({ ...state, signingError: error, signingStatus: "ERROR" })),
	on(EwaybillActions.createEwaybillDraftThenSign, (state): EwaybillState => ({ ...state, signingStatus: "PENDING" })),
	on(EwaybillActions.saveSignedEwaybillDraftSuccess, (state): EwaybillState => ({ ...state, signingStatus: "OK" })),
	on(EwaybillActions.getEwaybillDraftNumberSuccess, (state, { ewaybillDraftNumber }): EwaybillState => ({ ...state, ewaybillDraftNumber })),
	on(EwaybillCancelActions.errorCancelingEwaybill, (state, { error }): EwaybillState => ({ ...state, cancelError: error, cancelingStatus: "ERROR" })),
	on(EwaybillCancelActions.getSignedAndCanceledDraftThenSaveDraft, (state): EwaybillState => ({ ...state, cancelingStatus: "PENDING" })),
	on(EwaybillCancelActions.cancelingDraftSuccess, (state): EwaybillState => ({ ...state, cancelingStatus: "OK" })),

	on(EwaybillActions.getEwaybillDocumentSuccess, (state, { ewaybill }): EwaybillState => ({ ...state, ewaybill, cancelingStatus: undefined })),
	on(EwaybillActions.sendSignedEwaybillDraftError, (state, { error }): EwaybillState => ({ ...state, sendingError: error })),
	on(EwaybillActions.getReceivedEwaybillSuccess, (state, { ewaybillReceived }): EwaybillState => ({ ...state, ewaybillReceived })),
	on(EwaybillActions.resetEwaybillReceived, (state, { ewaybillReceived }): EwaybillState => ({ ...state, ewaybillReceived })),
	on(EwaybillActions.getResponseEwaybillDraftSuccess, (state, { ewaybillResponseDraft }): EwaybillState => ({ ...state, ewaybillResponseDraft })),
	on(EwaybillActions.resetResponseEwaybillDraft, (state, { ewaybillResponseDraft }): EwaybillState => ({ ...state, ewaybillResponseDraft })),
	on(EwaybillActions.checkSignSuccess, (state, { statusOfCheckSign }): EwaybillState => ({ ...state, statusOfCheckSign })),
	on(EwaybillActions.resetStatusOfCheckSign, (state, { statusOfCheckSign }): EwaybillState => ({ ...state, statusOfCheckSign })),
	on(EwaybillActions.confirmError, (state, { errors }): EwaybillState => ({ ...state, confirmationError: errors, signingStatus: "ERROR" })),
	on(EwaybillActions.resetConfirmError, (state, { errors }): EwaybillState => ({ ...state, confirmationError: errors, signingStatus: "OK" })),
	on(EwaybillActions.errorCreateEwaybillThenSign, (state, { errors }): EwaybillState => ({ ...state, errorCreateEwaybillThenSign: errors, signingStatus: "ERROR" })),
	on(EwaybillActions.createEwaybillThenSign, (state): EwaybillState => ({ ...state, signingStatus: "PENDING" })),
	on(EwaybillActions.saveSignedBLRAPNSuccess, (state): EwaybillState => ({ ...state, signingStatus: "OK" })),
	on(EwaybillActions.findXmlThenSign, (state): EwaybillState => ({ ...state, signingStatus: "PENDING" })),
	on(EwaybillActions.errorFindXmlThenSign, (state, { errors }): EwaybillState => ({ ...state, errorFindXmlThenSign: errors, signingStatus: "ERROR" })),
	on(EwaybillActions.validateAndSaveSignedSuccess, (state): EwaybillState => ({ ...state, signingStatus: "OK" })),
	on(EwaybillActions.getProviderConfirmationSuccess, (state, { providerConfirmation }): EwaybillState => ({ ...state, providerConfirmation })),
	on(EwaybillActions.confirmEwaybillReceipt2651Error, (state, { error }): EwaybillState => ({ ...state, confirmEwaybillReceipt2651Error: error })),
	on(EwaybillActions.confirmEwaybillReceipt, (state): EwaybillState => ({ ...state, signingStatus: "PENDING" })),
	on(EwaybillActions.confirmEwaybillReceiptSuccess, (state): EwaybillState => ({ ...state, signingStatus: "OK" })),
	on(EwaybillActions.confirmEwaybillReceipt2651, (state): EwaybillState => ({ ...state, signingStatus: "PENDING" })),
	on(EwaybillActions.confirmEwaybillReceipt2651Success, (state): EwaybillState => ({ ...state, signingStatus: "OK" })),
	on(EwaybillActions.signEwaybillDraft, (state, { draftId }): EwaybillState => ({ ...state, id: draftId }))
);

export function reducer(state: EwaybillState | undefined, action: Action): EwaybillState {
	return ewaybillReducer(state, action);
}
