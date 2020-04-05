import { createAction } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { EinvoiceParams, Einvoice } from "@helper/abstraction/einvoice";

export const saveEinvocieDraft = createAction(
	"[Einvoice] Save Einvocie Draft",
	(payload: Partial<EinvoiceParams>): { einvoice: Partial<EinvoiceParams> } => ({ einvoice: payload })
);

export const saveEinvocieDraftSuccess = createAction(
	"[Einvoice] Save Einvocie Success Draft",
	(payload: number): { id: number } => ({ id: payload })
);

export const saveEinvocieDraftError = createAction(
	"[Einvoice] Save Einvocie Error Draft",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const getEinvocieDraft = createAction(
	"[Einvoice] Get Einvocie Draft",
	(payload: number): { id: number } => ({ id: payload })
);

export const getEinvocieDraftSuccess = createAction(
	"[Einvoice] Get Einvocie Draft Success",
	(payload: Einvoice): { einvoice: Einvoice } => ({ einvoice: payload })
);

export const getEinvocieDraftError = createAction(
	"[Einvoice] Get Einvocie Draft Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);



