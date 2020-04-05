import { createAction } from "@ngrx/store";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { DraftType, SignedDraft } from "@helper/abstraction/draft";
import { HttpErrorResponse } from "@angular/common/http";
import { DocumentKind } from "@helper/abstraction/documents";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

export const saveEinvoicepmtDraft = createAction(
	"[Einvoicepmt] Save Einvoicepmt Draft",
	(payload: EinvoicepmtDto): { document: EinvoicepmtDto } => ({ document: payload })
);

export const saveEinvoicepmtDraftSuccess = createAction(
	"[Einvoicepmt] Save Einvoicepmt Draft Success",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveEinvoicepmtDraftError = createAction(
	"[Einvoicepmt] Save Einvoicepmt Draft Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getEinvoicepmtDocument = createAction(
	"[Einvoicepmt] Get Einvoicepmt Document",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getEinvoicepmtDocumentSuccess = createAction(
	"[Einvoicepmt] Get Einvoicepmt Document Success",
	(payload: EinvoicepmtDto): { einvoicepmt: EinvoicepmtDto } => ({ einvoicepmt: payload })
);

export const getEinvoicepmtDocumentError = createAction(
	"[Einvoicepmt] Get Einvoicepmt Document Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const getEinvoicepmtDocumentDraft = createAction(
	"[Einvoicepmt] Get Einvoicepmt Draft Document",
	(draftType: DraftType, draftId: number): { draftType: DraftType; draftId: number } => ({ draftType, draftId })
);

export const getEinvoicepmtDocumentDraftSuccess = createAction(
	"[Einvoicepmt] Get Einvoicepmt Document Draft Success",
	(payload: EinvoicepmtDto): { einvoicepmt: EinvoicepmtDto } => ({ einvoicepmt: payload })
);

export const getEinvoicepmtDocumentDraftError = createAction(
	"[Einvoicepmt] Get Einvoicepmt Document Draft Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const signingEinvoicepmtDocumentError = createAction(
	"[Einvoicepmt] Signing Einvoicepmt Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

export const getEinvoicepmtDraftNumber = createAction(
	"[Einvoicepmt] Get Einvoicepmt Draft Number",
	(payload: DraftType): { draftType: DraftType } => ({ draftType: payload })
);

export const getEinvoicepmtDraftNumberSuccess = createAction(
	"[Einvoicepmt] Get Einvoice Draft Number Success",
	(payload: string): { einvoicepmtDraftNumber: string } => ({ einvoicepmtDraftNumber: payload })
);

export const resetEinvoicepmtDraftNumber = createAction(
	"[Einvoicepmt] Reset Einvoicepmt Draft Number"
);

export const deleteEinvoicepmtDraft = createAction(
	"[Einvoicepmt] Delete Einvoicepmt Draft",
	(orderId: number, orderType: DraftType): { orderId: number; orderType: DraftType } => ({ orderId, orderType })
);

export const deleteEinvoicepmtDraftSuccess = createAction(
	"[Einvoicepmt] Delete Einvoicepmt Success"
);

export const deleteEinvoicepmtDraftError = createAction(
	"[Einvoicepmt] Delete Einvoicepmt Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const saveSignedEinvoicepmtDraftSuccess = createAction(
	"[Einvoicepmt] Save Signed Einvoicepmt Draft Success",
);

export const createEinvoicepmtDraftThenSign = createAction(
	"[Einvoicepmt] Create Einvoicepmt Draft Then Sign"
);

export const sendSignedEinvoicepmtDraft = createAction(
	"[Einvoicepmt] Send Einvoicepmt Draft",
	(payload: { draftType: DraftType; draftId: string }): { draftType: DraftType; draftId: string } => ({ ...payload })
);

export const sendSignedEinvoicepmtDraftSuccess = createAction(
	"[Einvoicepmt] Send Einvoicepmt Draft Success"
);

export const sendSignedEinvoicepmtDraftError = createAction(
	"[Einvoicepmt] Send Einvoicepmt Draft Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

export const openSignedDraft = createAction(
	"[Einvoicepmt] Open Signed Draft",
	(payload: SignedDraft<DocumentKind>): { signedDraft: SignedDraft<DocumentKind> } => ({ signedDraft: payload })
);

export const confirmEinvoicepmtReceipt = createAction(
	"[Einvoicepmt] Confirm Einvoicepmt Receipt",
	(payload: number): { documentId: number } => ({ documentId: payload })
);

export const confirmEinvoicepmtReceiptSuccess = createAction(
	"[Einvoicepmt] Confirm Einvoicepmt Receipt Success",
);

export const confirmEinvoicepmtReceiptError = createAction(
	"[Einvoicepmt] Confirm Einvoicepmt Receipt Error",
	(payload: HttpErrorResponse): { errors: HttpErrorResponse } => ({ errors: payload })
);

export const confirmError = createAction(
	"[Einvoicepmt] Confirm  Error",
	(payload: Error | HttpErrorResponse): { errors: Error | HttpErrorResponse } => ({ errors: payload })
);

export const checkSign = createAction(
	"[Einvoicepmt] Check Sign",
	(payload: { documentId: string }): { params: { documentId: string } } => ({ params: payload })
);

export const checkSignSuccess = createAction(
	"[Einvoicepmt] Check Sign Success",
	(payload: boolean): { statusOfCheckSign: boolean } => ({ statusOfCheckSign: payload })
);

export const checkSignError = createAction(
	"[Einvoicepmt] Check Sign Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetStatusOfCheckSign = createAction(
	"[Einvoicepmt] Reset Status Of Check Sign",
	(): { statusOfCheckSign: undefined } => ({ statusOfCheckSign: undefined })
);

export const resetEinvoicepmt = createAction(
	"[Einvoicepmt] Reset",
);

export const getProviderConfirmation = createAction(
	"[Einvoicepmt] Get Provider Confirmation",
	(payload: string): { id: string } => ({ id: payload })
);

export const getProviderConfirmationSuccess = createAction(
	"[Einvoicepmt] Get Provider Confirmation  Success",
	(payload: ProviderConfirmation): { providerConfirmation: ProviderConfirmation } => ({ providerConfirmation: payload })
);

export const getProviderConfirmationError = createAction(
	"[Einvoicepmt] Get Provider Confirmation Error",
	(payload: HttpErrorResponse): { errors: HttpErrorResponse } => ({ errors: payload })
);
