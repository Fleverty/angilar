import { DocumentNavigator } from "@app/user/documents/document-list/document-navigator";
import { Document } from "@helper/abstraction/documents";
import { documentState } from "@helper/paths";

export class DocumentOrdersNavigator extends DocumentNavigator {
	protected navigateDraft(document: Document): void {
		const queryParams = {
			draftId: document.id,
			draftType: document.messageType
		};
		if (document.processingStatus) {
			if (document.processingStatus.id === "DRAFT") {
				if (document.messageType === "ORDERS")
					this.router.navigate(["user", "documents", "ORDERS", "edit"], { queryParams: { ...queryParams, kind: document.documentNameCode } });
				if (document.messageType === "ORDRSP")
					this.router.navigate(["user", "documents", "ORDERS", documentState.draft, "response", document.messageType, document.documentNameCode, document.id]);
			}
		}
	}

	protected navigateIncoming(document: Document): void {
		const defaultRoutes = ["user", "documents", "ORDERS", documentState.incoming];
		const typeAndId = [document.messageType ? document.messageType : "ORDERS", document.documentNameCode, document.id];
		if (document.processingStatus) {
			switch (document.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", ...typeAndId]);
					break;
				}
				case "ACCEPTED": {
					this.router.navigate([...defaultRoutes, "accepted", ...typeAndId]);
					break;
				}
				case "ACCEPTED_WITH_CHANGES": {
					this.router.navigate([...defaultRoutes, "accepted", "with", "changes", ...typeAndId]);
					break;
				}
				case "CANCELED_BY_SUPPLIER": {
					this.router.navigate([...defaultRoutes, "canceled", "by", "supplier", ...typeAndId]);
					break;
				}
				case "CANCELED_BY_BUYER": {
					this.router.navigate([...defaultRoutes, "canceled", "by", "buyer", ...typeAndId]);
					break;
				}
				case "ACCEPTED_CANCELED_BY_BUYER": {
					this.router.navigate([...defaultRoutes, "accepted", "canceled", "by", "buyer", ...typeAndId]);
					break;
				}
				default:
					this.navigateToNotFound();
			}
		}
	}

	protected navigateOutgoing(document: Document): void {
		const defaultRoutes = ["user", "documents", "ORDERS", documentState.outgoing];
		const typeAndId = [document.messageType ? document.messageType : "ORDERS", document.documentNameCode, document.id];
		if (document.processingStatus) {
			switch (document.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate([...defaultRoutes, "transferred", ...typeAndId]);
					break;
				}
				case "ACCEPTED": {
					this.router.navigate([...defaultRoutes, "accepted", ...typeAndId]);
					break;
				}
				case "ACCEPTED_WITH_CHANGES": {
					this.router.navigate([...defaultRoutes, "accepted", "with", "changes", ...typeAndId]);
					break;
				}
				case "CANCELED_BY_SUPPLIER": {
					this.router.navigate([...defaultRoutes, "canceled", "by", "supplier", ...typeAndId]);
					break;
				}
				case "CANCELED_BY_BUYER": {
					this.router.navigate([...defaultRoutes, "canceled", "by", "buyer", ...typeAndId]);
					break;
				}
				case "ACCEPTED_CANCELED_BY_BUYER": {
					this.router.navigate([...defaultRoutes, "accepted", "canceled", "by", "buyer", ...typeAndId]);
					break;
				}
				default:
					this.navigateToNotFound();
			}
		}
	}

}
