import { Document } from "@helper/abstraction/documents";
import { DocumentNavigator } from "./document-navigator";
import { documentState } from "@helper/paths";

export class DocumentShipmentNotificationNavigator extends DocumentNavigator {
	protected navigateDraft(document: Document): void {

		const id: string = document.id;
		if (document.processingStatus && document.processingStatus.id === "DRAFT") {
			this.router.navigate(["user", "documents", "DESADV", "edit", id]);
		} else {
			this.navigateToNotFound();
		}
	}

	protected navigateIncoming(doc: Document): void {
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate(["user", "documents", "DESADV", documentState.incoming, "transferred", doc.id]);
					break;
				}
				case "ACCEPTED": {
					this.router.navigate(["user", "documents", "DESADV", documentState.incoming, "accepted", doc.id]);
					break;
				}
			}
		}
	}

	protected navigateOutgoing(doc: Document): void {
		if (doc.processingStatus) {
			switch (doc.processingStatus.id) {
				case "TRANSFERRED": {
					this.router.navigate(["user", "documents", "DESADV", documentState.outgoing, "transferred", doc.id]);
					break;
				}
				case "ACCEPTED": {
					this.router.navigate(["user", "documents", "DESADV", documentState.outgoing, "accepted", doc.id]);
					break;
				}
			}
		}
	}
}
