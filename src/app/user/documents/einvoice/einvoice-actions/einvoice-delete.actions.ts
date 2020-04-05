import { createAction } from "@ngrx/store";

export const deleteEinvoice = createAction(
	"[Einvoice] Delete Einvoice",
	(draftId: string): { draftId: string } => ({ draftId })
);

export const deleteEinvoiceSuccess = createAction(
	"[Einvoice] Delete Einvoice Success"
);

export const deleteEinvoiceError = createAction(
	"[Einvoice] Delete Einvoice Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
