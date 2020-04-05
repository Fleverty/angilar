import { Document } from "@helper/abstraction/documents";
import { DocumentNavigator } from "@app/user/documents/document-list/document-navigator";
import { documentState } from "@helper/paths";

export class DocumentEinvoicepmtNavigator extends DocumentNavigator {
	protected navigateDraft(document: Document): void {
		const id: string = document.id;
		if (document.processingStatus)
			switch (document.processingStatus.id) {
				case "DRAFT": {
					this.router.navigate(["user", "documents", "EINVOICEPMT", "edit", id]);
					break;
				}
				case "SIGNED_DRAFT":
				case "FINALLY_SIGNED_DRAFT": {
					this.router.navigate(["user", "documents", "EINVOICEPMT", "signed-draft", id]);
					break;
				}
				case "SENT": {
					this.router.navigate(["user", "documents", "EINVOICEPMT", documentState.draft, "sending", id]);
					break;
				}
				default: {
					this.navigateToNotFound();
					break;
				}
			}
	}

	protected navigateOutgoing(doc: Document): void {
		const defaultRoutes = ["user", "documents", "EINVOICEPMT", documentState.outgoing];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.id]);
					break;
				}
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", doc.id]);
					break;
				}
				case "RECEIVED": {
					this.router.navigate([...defaultRoutes, "received", doc.id]);
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
		const defaultRoutes = ["user", "documents", "EINVOICEPMT", documentState.incoming];
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "SENT": {
					this.router.navigate([...defaultRoutes, "sending", doc.id]);
					break;
				}
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", doc.id]);
					break;
				}
				case "RECEIVED": {
					this.router.navigate([...defaultRoutes, "received", doc.id]);
					break;
				}
				default: {
					this.navigateToNotFound();
					break;
				}
			}
		}
	}
}
