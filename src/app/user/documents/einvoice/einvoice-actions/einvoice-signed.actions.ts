import { createAction } from "@ngrx/store";
import { Einvoice } from "@helper/abstraction/einvoice";
import { HttpErrorResponse } from "@angular/common/http";
import { DraftType } from "@helper/abstraction/draft";

export const getEinvoiceDocument = createAction(
	"[Einvoice] Get Einvoice Document Einvoice",
	(draftId: number): { draftId: number } => ({ draftId })
);

export const getEinvoiceDocumentSuccess = createAction(
	"[Einvoice] Get Einvoice Document Success",
	(payload: Einvoice): { einvoice: Einvoice } => ({ einvoice: payload })
);

export const getEinvoiceDocumentError = createAction(
	"[Einvoice] Get Einvoice Document Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const sendSignedEinvoiceDraft = createAction(
	"[Einvoice] Send Signed Einvoice Draft",
	(payload: { draftType: DraftType; draftId: string }): { draftType: DraftType; draftId: string } => ({ ...payload })
);

export const sendSignedEinvoiceDraftSuccess = createAction(
	"[Einvoice] Send Signed Einvoice Draft Success"
);

export const sendSignedEinvoiceDraftError = createAction(
	"[Einvoice] Send Signed Einvoice Draft Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);
