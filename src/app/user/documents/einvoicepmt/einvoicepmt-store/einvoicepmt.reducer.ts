import { Action, createReducer, on } from "@ngrx/store";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import * as EinvoicepmtActions from "./einvoicepmt.actions";
import { HttpErrorResponse } from "@angular/common/http";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

export interface EinvoicepmtState {
	einvoicepmt?: EinvoicepmtDto;
	signingError?: HttpErrorResponse | Error;
	sendingError?: HttpErrorResponse | Error;
	confirmationError?: HttpErrorResponse | Error;
	signingStatus: "ERROR" | "PENDING" | "OK";
	einvoicepmtDraftNumber?: string;
	statusOfCheckSign?: boolean;
	providerConfirmation?: ProviderConfirmation;
}

const initialState: EinvoicepmtState = {
	signingStatus: "OK",
};

const einvoicepmtReducer = createReducer(
	initialState,
	on(EinvoicepmtActions.getEinvoicepmtDocumentSuccess, (state, { einvoicepmt }): EinvoicepmtState => ({ ...state, einvoicepmt })),
	on(EinvoicepmtActions.getEinvoicepmtDocumentDraftSuccess, (state, { einvoicepmt }): EinvoicepmtState => ({ ...state, einvoicepmt })),
	on(EinvoicepmtActions.signingEinvoicepmtDocumentError, (state, { error }): EinvoicepmtState => ({ ...state, signingError: error, signingStatus: "ERROR" })),
	on(EinvoicepmtActions.getEinvoicepmtDraftNumberSuccess, (state, { einvoicepmtDraftNumber }): EinvoicepmtState => ({ ...state, einvoicepmtDraftNumber })),
	on(EinvoicepmtActions.saveSignedEinvoicepmtDraftSuccess, (state): EinvoicepmtState => ({ ...state, signingStatus: "OK" })),
	on(EinvoicepmtActions.createEinvoicepmtDraftThenSign, (state): EinvoicepmtState => ({ ...state, signingStatus: "PENDING" })),
	on(EinvoicepmtActions.sendSignedEinvoicepmtDraftError, (state, { error }) => ({ ...state, sendingError: error })),
	on(EinvoicepmtActions.confirmEinvoicepmtReceiptSuccess, (state): EinvoicepmtState => ({ ...state, signingStatus: "OK" })),
	on(EinvoicepmtActions.confirmError, (state, { errors }): EinvoicepmtState => ({ ...state, confirmationError: errors, signingStatus: "ERROR" })),
	on(EinvoicepmtActions.checkSignSuccess, (state, { statusOfCheckSign }): EinvoicepmtState => ({ ...state, statusOfCheckSign })),
	on(EinvoicepmtActions.resetStatusOfCheckSign, (state, { statusOfCheckSign }): EinvoicepmtState => ({ ...state, statusOfCheckSign })),
	on(EinvoicepmtActions.resetEinvoicepmt, (state): EinvoicepmtState => ({ ...state, einvoicepmt: undefined })),
	on(EinvoicepmtActions.getProviderConfirmationSuccess, (state, { providerConfirmation }): EinvoicepmtState => ({ ...state, providerConfirmation })),
	on(EinvoicepmtActions.resetEinvoicepmtDraftNumber, (state): EinvoicepmtState => ({ ...state, einvoicepmtDraftNumber: undefined }))
);

export function reducer(state: EinvoicepmtState | undefined, action: Action): EinvoicepmtState {
	return einvoicepmtReducer(state, action);
}
