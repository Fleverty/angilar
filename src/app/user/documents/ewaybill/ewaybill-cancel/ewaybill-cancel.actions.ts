import { createAction } from "@ngrx/store";
import { Draft, DraftType } from "@helper/abstraction/draft";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { MessageType } from "@helper/abstraction/documents";
import { HttpErrorResponse } from "@angular/common/http";

export const getSignedAndCanceledDraftThenSaveDraft = createAction(
	"[Cancel Ewaybill] Canceled Then Signed Then Saved Draft",
	(payload: { draftType: DraftType; documentId: string; document: Ewaybill }): { draftType: DraftType; documentId: string; document: Ewaybill } => ({ ...payload })
);

export const getCanceledAndSignedDraft = createAction(
	"[Cancel Ewaybill] Get Canceled And Signed Draft",
	(payload: { draftType: DraftType; documentId: string; document: Ewaybill }): { draftType: DraftType; documentId: string; document: Ewaybill } => ({ ...payload })
);

export const cancelEwaybill = createAction(
	"[Cancel Ewaybill] Cancel Ewaybill",
	(payload: { draftType: DraftType; documentId: string; document: Ewaybill }): { draftType: DraftType; documentId: string; document: Ewaybill } => ({ ...payload })
);

export const cancelEwaybillSuccess = createAction(
	"[Cancel Ewaybill] Cancel Ewaybill Success",
	(payload: Draft<Ewaybill>): { draft: Draft<Ewaybill> } => ({ draft: payload })
);

export const cancelEwaybillError = createAction(
	"[Cancel Ewaybill] Cancel Ewaybill Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const sendSignedCancel = createAction(
	"[Cancel Ewaybill] Send Signed Cancel",
	(payload: { id: string; xmlBody: string; messageType: MessageType }): { id: string; xmlBody: string; messageType: MessageType } => ({ ...payload })
);

export const sendSignedCancelSuccess = createAction(
	"[Cancel Ewaybill] Send Signed Cancel Success"
);

export const sendSignedCancelError = createAction(
	"[Cancel Ewaybill] Send Signed Cancel Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const errorCancelingEwaybill = createAction(
	"[Ewaybill] Canceling Draft Error",
	(payload: Error | HttpErrorResponse): { error: Error | HttpErrorResponse } => ({ error: payload })
);

export const cancelingDraftSuccess = createAction(
	"[Cancel Ewaybill] Canceling Draft Success"
);
