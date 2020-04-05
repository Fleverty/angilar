import { DocumentNavigator } from "./document-navigator";

export class DocumentDefaultNavigator extends DocumentNavigator {

	public navigateDraft(): void {
		this.navigateToNotFound();
	}

	public navigateIncoming(): void {
		this.navigateToNotFound();
	}

	public navigateOutgoing(): void {
		this.navigateToNotFound();
	}
}
