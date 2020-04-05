import { createAction } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { SignedDraftDto } from "@helper/abstraction/draft";

export const cancelEinvoice = createAction(
	"[Einvoice] Cancel Einvoice",
	(payload: string): { documentId: string } => ({ documentId: payload })
);

export const cancelEinvoiceSuccess = createAction(
	"[Einvoice] Cancel Einvoice Success",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const cancelEinvoiceError = createAction(
	"[Einvoice] Cancel Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const saveSignedCanceledEinvoice = createAction(
	"[Einvoice] Save Signed Canceled Einvoice",
	(signedEinvoice: SignedDraftDto, id: string): { signedEinvoice: SignedDraftDto; id: string } => ({ signedEinvoice, id })
);

export const saveSignedCanceledEinvoiceSuccess = createAction(
	"[Einvoice] Save Signed Canceled Einvoice Success",
	(payload: string): { id: string } => ({ id: payload })
);

export const saveSignedCanceledEinvoiceError = createAction(
	"[Einvoice] Save Signed Canceled Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const resetConfirmationError = createAction("[Einvoice] Reset Confirmation Error");

export const confirmCancelEinvoice = createAction(
	"[Einvoice] Confirm Cancel Einvoice",
	(payload: string): { documentId: string } => ({ documentId: payload })
);

export const confirmCancelEinvoiceSuccess = createAction(
	"[Einvoice] Confirm Cancel Einvoice Success",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const confirmCancelEinvoiceError = createAction(
	"[Einvoice] Confirm Cancel Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const saveSignedConfirmationCancellationEinvoice = createAction(
	"[Einvoice] Save Signed Confirmation Cancellation Einvoice",
	(signedEinvoice: SignedDraftDto, id: string): { signedEinvoice: SignedDraftDto; id: string } => ({ signedEinvoice, id })
);

export const saveSignedConfirmationCancellationSuccess = createAction(
	"[Einvoice] Save Signed Confirmation Cancellation Einvoice Success",
	(payload: string): { id: string } => ({ id: payload })
);

export const saveSignedConfirmationCancellationEinvoiceError = createAction(
	"[Einvoice] Save Signed ConfirmationCancellation  Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
