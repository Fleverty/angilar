import { createAction } from "@ngrx/store";
import { EinvoiceParams } from "@helper/abstraction/einvoice";
import { HttpErrorResponse } from "@angular/common/http";
import { SignedDraftDto } from "@helper/abstraction/draft";

export const signEinvocieDraft = createAction(
	"[Einvoice] Sign Einvocie Draft",
	(payload: EinvoiceParams): { einvoice: EinvoiceParams } => ({ einvoice: payload })
);

export const signEinvocieDraftSuccess = createAction(
	"[Einvoice] Sign Einvocie Success Draft",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const signEinvocieDraftError = createAction(
	"[Einvoice] Sign Einvocie Error Draft",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const saveSignedEinvoiceDraft = createAction(
	"[Einvoice] Save Signed Einvocie Draft",
	(signedEinvoice: SignedDraftDto, id: string): { signedEinvoice: SignedDraftDto; id: string } => ({ signedEinvoice, id })
);

export const saveSignedEinvoiceDraftSuccess = createAction(
	"[Einvoice] Save Signed Einvocie Draft Success",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveSignedEinvoiceDraftError = createAction(
	"[Einvoice] Save Signed Einvocie Draft Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
