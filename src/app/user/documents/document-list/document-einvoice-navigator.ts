import { DocumentNavigator } from "./document-navigator";
import { Document } from "@helper/abstraction/documents";
import { documentState } from "@helper/paths";

export class DocumentEinvoiceNavigator extends DocumentNavigator {
	protected navigateDraft(document: Document): void {
		const queryParams = {
			draftId: document.id,
			draftType: document.messageType || "BLRINV"
		};
		if (document.processingStatus) {
			if (document.processingStatus.id === "DRAFT") {
				this.router.navigate(["user", "documents", "EINVOICE", "edit"], { queryParams: { ...queryParams, kind: document.documentNameCode } });
			} else if (document.processingStatus.id === "SIGNED_DRAFT" || document.processingStatus.id === "FINALLY_SIGNED_DRAFT") {
				this.router.navigate(["user", "documents", "EINVOICE", "sign-draft", document.id]);
			}

			if (document.processingStatus.id === "SENT")
				this.router.navigate(["user", "documents", "EINVOICE", "draft", "sending", document.id]);
		}
	}

	protected navigateOutgoing(doc: Document): void {
		const defaultRoutes = ["user", "documents", "EINVOICE", documentState.outgoing];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", doc.id]);
					break;
				}
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.id]);
					break;
				}
				case "CREATED": {
					this.router.navigate([...defaultRoutes, "created", doc.id]);
					break;
				}
				case "CANCELED": {
					this.router.navigate([...defaultRoutes, "canceled", doc.messageType, doc.id]);
					break;
				}
				case "NOT_CONFIRMED_CANCEL":
					this.router.navigate([...defaultRoutes, "not", "confirmed", "cancel", doc.id]);
					break;
				default: {
					this.navigateToNotFound();
					break;
				}
			}
		}
	}

	protected navigateIncoming(doc: Document): void {
		const defaultRoutes = ["user", "documents", "EINVOICE", documentState.incoming];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", doc.id]);
					break;
				}
				case "CREATED": {
					this.router.navigate([...defaultRoutes, "created", doc.id]);
					break;
				}
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.id]);
					break;
				}
				case "CANCELED":
					this.router.navigate([...defaultRoutes, "canceled", doc.id]);
					break;
				case "NOT_CONFIRMED_CANCEL":
					this.router.navigate([...defaultRoutes, "not", "confirmed", "cancel", doc.id]);
					break;
				default: {
					this.navigateToNotFound();
					break;
				}
			}
		}
	}
}
