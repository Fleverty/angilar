import { createAction } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { SignedDraftDto } from "@helper/abstraction/draft";

export const signEinvocieResponse = createAction(
	"[Einvoice] Sign Einvocie Response",
	(payload: number): { documentId: number } => ({ documentId: payload })
);

export const signEinvocieResponseSuccess = createAction(
	"[Einvoice] Sign Einvocie Response Success",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const signEinvocieResponseError = createAction(
	"[Einvoice] Sign Einvocie Response Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const saveResponseSignedEinvoice = createAction(
	"[Einvoice] Save Response Signed Einvocie ",
	(signedEinvoice: SignedDraftDto, id: string): { signedEinvoice: SignedDraftDto; id: string } => ({ signedEinvoice, id })
);

export const saveResponseSignedEinvoiceSuccess = createAction(
	"[Einvoice] Save Response Signed Einvocie Success",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveResponseSignedEinvoiceError = createAction(
	"[Einvoice] Save Signed Einvocie Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
