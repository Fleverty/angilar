import { DocumentNavigator } from "./document-navigator";
import { Document } from "@helper/abstraction/documents";
import { Store } from "@ngrx/store";
import { DocumentsState } from "../documents.reducer";
import { Router } from "@angular/router";
import { openDocument } from "../documents.actions";
import { documentState } from "@helper/paths";

export class DocumentEwaybillNavigator extends DocumentNavigator {
	constructor(router: Router, public store: Store<DocumentsState>) {
		super(router);
	}

	protected dispatch(doc: Document): void {
		this.store.dispatch(openDocument(doc));
	}

	protected navigateDraft(doc: Document): void {
		const queryParams = {
			draftId: doc.id,
			draftType: doc.messageType
		};
		if (doc.processingStatus) {
			if (doc.processingStatus.id === "DRAFT") {
				if (["BLRDNR", "BLRWBR"].indexOf(doc.messageType) !== -1)
					this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft, "response", doc.messageType, doc.id], { queryParams: { kind: doc.documentNameCode } });
				if (["BLRWBL", "BLRDLN"].indexOf(doc.messageType) !== -1)
					this.router.navigate(["user", "documents", "EWAYBILL", "edit"], { queryParams: { ...queryParams, kind: doc.documentNameCode } });
			} else if (doc.processingStatus.id === "FINALLY_SIGNED_DRAFT") {
				if (["BLRDNR", "BLRWBR"].indexOf(doc.messageType) !== -1)
					this.router.navigate(["user", "documents", "EWAYBILL", "response", "sign-draft", doc.messageType, doc.id]);
				if (["BLRWBL", "BLRDLN"].indexOf(doc.messageType) !== -1)
					this.router.navigate(["user", "documents", "EWAYBILL", "sign-draft", doc.messageType, doc.id]);
			}

			if (doc.processingStatus.id === "SENT")
				this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft, "sending", doc.messageType, doc.id]);
		}
	}

	protected navigateOutgoing(doc: Document): void {
		const defaultRoutes = ["user", "documents", "EWAYBILL", documentState.outgoing];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "CANCELED": {
					this.router.navigate([...defaultRoutes, "canceled", doc.messageType, doc.id]);
					break;
				}
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", doc.messageType, doc.id]);
					break;
				}
				case "RECEIVED": {
					this.router.navigate([...defaultRoutes, "received", doc.messageType, doc.id]);
					break;
				}
				case "CREATED": {
					this.router.navigate([...defaultRoutes, "created", doc.messageType, doc.id]);
					break;
				}
				case "CHANGE_REQUIRED": {
					this.router.navigate([...defaultRoutes, "change", "required", doc.messageType, doc.id]);
					break;
				}
				case "CREATED_CONFIRMED": {
					this.router.navigate([...defaultRoutes, "created", "confirmed", doc.messageType, doc.id]);
					break;
				}
				case "NOT_CONFIRMED_CANCEL": {
					this.router.navigate([...defaultRoutes, "not", "confirmed", "cancel", doc.messageType, doc.id]);
					break;
				}
				case "CHANGE_REQUIRED_NOT_CONFIRMED": {
					this.router.navigate([...defaultRoutes, "change", "required", "not", "confirmed", doc.messageType, doc.id]);
					break;
				}
				case "CREATED_CANCEL_SENT": {
					this.router.navigate([...defaultRoutes, "created", "cancel", "sent", doc.messageType, doc.id]);
					break;
				}
				case "CREATED_CONFIRMED_CANCEL_SENT": {
					this.router.navigate([...defaultRoutes, "created", "confirm", "cancel", "sent", doc.messageType, doc.id]);
					break;
				}
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.messageType, doc.id]);
					break;
				}
				default: {
					this.navigateToNotFound();
					break;
				}

			}
		}
	}

	protected navigateIncoming(doc: Document): void {
		const defaultRoutes = ["user", "documents", "EWAYBILL", documentState.incoming];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "CREATED":
					this.router.navigate([...defaultRoutes, "created", doc.messageType, doc.id]);
					break;
				case "CREATED_CONFIRMED":
					this.router.navigate([...defaultRoutes, "created", "confirmed", doc.messageType, doc.id]);
					break;
				case "CREATED_CANCEL_SENT":
					this.router.navigate([...defaultRoutes, "created", "cancel", "sent", doc.messageType, doc.id]);
					break;
				case "CREATED_CONFIRMED_CANCEL_SENT":
					this.router.navigate([...defaultRoutes, "created", "confirmed", "cancel", "sent", doc.messageType, doc.id]);
					break;
				case "RECEIVED":
					this.router.navigate([...defaultRoutes, "received", doc.messageType, doc.id]);
					break;
				case "TRANSFERRED":
					this.router.navigate([...defaultRoutes, "transferred", doc.messageType, doc.id]);
					break;
				case "CANCELED":
					this.router.navigate([...defaultRoutes, "canceled", doc.messageType, doc.id]);
					break;
				case "NOT_CONFIRMED_CANCEL":
					this.router.navigate([...defaultRoutes, "canceled", "not", "confirmed", doc.messageType, doc.id]);
					break;
				case "CHANGE_REQUIRED":
					this.router.navigate([...defaultRoutes, "change", "required", doc.messageType, doc.id]);
					break;
				case "CHANGE_REQUIRED_NOT_CONFIRMED":
					this.router.navigate([...defaultRoutes, "change", "required", "not", "confirmed", doc.messageType, doc.id]);
					break;
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.messageType, doc.id]);
					break;
				}
				default:
					this.navigateToNotFound();
			}
		}
	}
}
