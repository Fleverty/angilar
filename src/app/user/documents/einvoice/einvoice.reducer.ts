import { Action, createReducer, on } from "@ngrx/store";
import { ProductExtraField } from "@helper/abstraction/extra-fields";
import { UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { Country } from "@helper/abstraction/countries";
import { HttpErrorResponse } from "@angular/common/http";
import { Einvoice } from "@helper/abstraction/einvoice";
import * as EinvoiceSignedActions from "./einvoice-actions/einvoice-signed.actions";
import * as EinvoiceSignActions from "./einvoice-actions/einvoice-sign.actions";
import * as EinvoiceDraftActions from "./einvoice-actions/einvoice-draft.actions";
import * as EinvoiceMainActions from "./einvoice-actions/einvoice-main.actions";
import * as EinvoiceResponseActions from "./einvoice-actions/einvoice-response.actions";
import * as EinvoiceCancelActions from "./einvoice-actions/einvoice-cancel.actions";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

export interface EinvoiceState {
	einvoice?: Einvoice;
	einvoiceDraftNumber?: string;

	signingStatus: "ERROR" | "PENDING" | "OK";
	signingError?: HttpErrorResponse | Error;
	cancelingStatus?: "ERROR" | "PENDING" | "OK";
	cancelingError?: HttpErrorResponse;
	confirmationStatus?: "ERROR" | "PENDING" | "OK";
	confirmationError?: HttpErrorResponse;
	creatingStatus?: "ERROR" | "PENDING" | "OK";
	creatingError?: HttpErrorResponse;

	unitOfMeasures?: UnitOfMeasure[];
	countries?: Country[];
	productExtraFields?: ProductExtraField[];
	providerConfirmation?: ProviderConfirmation;
}

const initialState: EinvoiceState = {
	signingStatus: "OK",
};

const einvoiceReducer = createReducer(
	initialState,
	on(EinvoiceDraftActions.getEinvocieDraftSuccess, (state, { einvoice }): EinvoiceState => ({ ...state, einvoice })),

	on(EinvoiceSignActions.signEinvocieDraft, (state): EinvoiceState => ({ ...state, signingStatus: "PENDING" })),
	on(EinvoiceSignActions.saveSignedEinvoiceDraftSuccess, (state): EinvoiceState => ({ ...state, signingStatus: "OK" })),
	on(EinvoiceSignActions.saveSignedEinvoiceDraftError, (state, { error }): EinvoiceState => ({ ...state, signingError: error, signingStatus: "ERROR" })),
	on(EinvoiceSignActions.signEinvocieDraftError, (state, { error }): EinvoiceState => ({ ...state, signingError: error, signingStatus: "ERROR" })),

	on(EinvoiceResponseActions.signEinvocieResponse, (state): EinvoiceState => ({ ...state, signingStatus: "PENDING" })),
	on(EinvoiceResponseActions.saveResponseSignedEinvoiceSuccess, (state): EinvoiceState => ({ ...state, signingStatus: "OK" })),
	on(EinvoiceResponseActions.signEinvocieResponseError, (state, { error }): EinvoiceState => ({ ...state, signingError: error, signingStatus: "ERROR" })),
	on(EinvoiceResponseActions.saveResponseSignedEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, signingError: error, signingStatus: "ERROR" })),

	on(EinvoiceSignedActions.getEinvoiceDocumentSuccess, (state, { einvoice }): EinvoiceState => ({ ...state, einvoice })),

	on(EinvoiceCancelActions.cancelEinvoice, (state): EinvoiceState => ({ ...state, cancelingStatus: "PENDING" })),
	on(EinvoiceCancelActions.saveSignedCanceledEinvoiceSuccess, (state): EinvoiceState => ({ ...state, cancelingStatus: "OK" })),
	on(EinvoiceCancelActions.cancelEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, cancelingError: error, cancelingStatus: "ERROR" })),
	on(EinvoiceCancelActions.saveSignedCanceledEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, cancelingError: error, cancelingStatus: "ERROR" })),

	on(EinvoiceCancelActions.resetConfirmationError, (state): EinvoiceState => ({ ...state, confirmationStatus: undefined, confirmationError: undefined })),
	on(EinvoiceCancelActions.confirmCancelEinvoice, (state): EinvoiceState => ({ ...state, confirmationStatus: "PENDING" })),
	on(EinvoiceCancelActions.saveSignedConfirmationCancellationSuccess, (state): EinvoiceState => ({ ...state, confirmationStatus: "OK" })),
	on(EinvoiceCancelActions.confirmCancelEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, confirmationError: error, confirmationStatus: "ERROR" })),
	on(EinvoiceCancelActions.saveSignedConfirmationCancellationEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, confirmationError: error, confirmationStatus: "ERROR" })),

	on(EinvoiceMainActions.creatEditedEinvoice, (state): EinvoiceState => ({ ...state, creatingStatus: "PENDING" })),
	on(EinvoiceMainActions.saveSignedBlrapnEinvoiceSuccess, (state): EinvoiceState => ({ ...state, creatingStatus: "OK" })),
	on(EinvoiceMainActions.creatEditedEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, creatingError: error, creatingStatus: "ERROR" })),
	on(EinvoiceMainActions.saveSignedBlrapnEinvoiceError, (state, { error }): EinvoiceState => ({ ...state, creatingError: error, creatingStatus: "ERROR" })),

	on(EinvoiceMainActions.resetEinvoice, (state): EinvoiceState => ({ ...state, einvoice: undefined })),
	on(EinvoiceMainActions.getEinvoiceDraftNumberSuccess, (state, { einvoiceDraftNumber }): EinvoiceState => ({ ...state, einvoiceDraftNumber })),
	on(EinvoiceMainActions.resetEinvoiceDraftNumber, (state): EinvoiceState => ({ ...state, einvoiceDraftNumber: undefined })),
	on(EinvoiceMainActions.getUnitOfMeasuresSuccess, (state, { unitOfMeasures }): EinvoiceState => ({ ...state, unitOfMeasures })),
	on(EinvoiceMainActions.resetUnitOfMeasures, (state, { unitOfMeasures }): EinvoiceState => ({ ...state, unitOfMeasures })),
	on(EinvoiceMainActions.getCountriesSuccess, (state, { countries }): EinvoiceState => ({ ...state, countries })),
	on(EinvoiceMainActions.resetCountries, (state, { countries }): EinvoiceState => ({ ...state, countries })),
	on(EinvoiceMainActions.getProductExtraFieldsSuccess, (state, { productExtraFields }): EinvoiceState => ({ ...state, productExtraFields })),
	on(EinvoiceMainActions.resetProductExtraFields, (state, { productExtraFields }): EinvoiceState => ({ ...state, productExtraFields })),
	on(EinvoiceMainActions.getProviderConfirmationSuccess, (state, { providerConfirmation }): EinvoiceState => ({ ...state, providerConfirmation })),
);

export function reducer(state: EinvoiceState | undefined, action: Action): EinvoiceState {
	return einvoiceReducer(state, action);
}
