import { DocumentState, Document } from "@helper/abstraction/documents";
import { Router } from "@angular/router";

export abstract class DocumentNavigator {
	constructor(protected readonly router: Router) { }

	public navigate(state: DocumentState, document: Document): void {
		this.dispatch(document);

		switch (state) {
			case "DRAFT":
				this.navigateDraft(document);
				break;
			case "INCOMING":
				this.navigateIncoming(document);
				break;
			case "OUTGOING":
				this.navigateOutgoing(document);
				break;
			default:
				this.navigateToNotFound();
				break;
		}
	}

	protected dispatch(document: Document): void { // eslint-disable-line
		// do nothing
	}

	protected navigateToNotFound(): void {
		this.router.navigateByUrl("user/documents/not-found");
	}

	protected abstract navigateDraft(document: Document): void;

	protected abstract navigateIncoming(document: Document): void;

	protected abstract navigateOutgoing(document: Document): void;


}
