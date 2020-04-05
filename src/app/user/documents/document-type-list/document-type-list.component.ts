import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DocumentType, DescriptionDocumentType, NewInboxDocuments } from "@helper/abstraction/documents";
import { Store } from "@ngrx/store";
import { DocumentsState } from "../documents.reducer";
import { Router, ActivatedRoute } from "@angular/router";
import { switchDocumentType } from "../documents.actions";


@Component({
	selector: "app-document-type-list",
	templateUrl: "./document-type-list.component.html",
	styleUrls: ["./document-type-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentTypeListComponent {
	@Input() public documentTypes: DescriptionDocumentType[] = [];
	@Input() public newInboxDocuments?: NewInboxDocuments;

	constructor(
		private readonly store: Store<DocumentsState>,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute
	) {
	}

	public getInboxDocumentCount(docType: DocumentType): number {
		return this.newInboxDocuments && this.newInboxDocuments[docType] || 0;
	}

	public switchDocumentType(typeId: DocumentType): void {
		if (this.router.url.split("/")[3] !== typeId)
			this.router.navigate([typeId], { relativeTo: this.activatedRoute }).then(() => {
				this.store.dispatch(switchDocumentType(typeId));
			});
	}
}
