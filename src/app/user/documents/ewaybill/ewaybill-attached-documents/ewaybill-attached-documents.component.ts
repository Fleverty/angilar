import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { EwaybillFormBuilderService } from "../ewaybill/ewaybill-form-builder.service";

export interface EwaybillAttachedDocumentsForm {
	documentDate: Date;
	documentNumber: number;
	documentName: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-attached-documents",
	styleUrls: ["./ewaybill-attached-documents.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-attached-documents.component.html"
})
export class EwaybillAttachedDocumentsComponent {
	@Input() public form?: FormGroup;
	public showContent = true;
	public showAdding = false;
	public get documents(): FormArray {
		if (!this.form) throw Error("No form");
		return this.form.get("documents") as FormArray;
	}

	constructor(private ewaybillFormBuilderService: EwaybillFormBuilderService) { }

	public clearAllDocs(): void {
		this.showAdding = false;
		this.documents.clear();
	}

	public addDocument(initValue?: EwaybillAttachedDocumentsForm): void {
		const lastIndex = this.documents.length - 1;
		if (lastIndex === -1 || this.documents.at(lastIndex).valid) {
			this.documents.push(this.ewaybillFormBuilderService.getDocumentForm(initValue));
		}
	}

	public removeDocument(index: number): void {
		this.documents.removeAt(index);
	}
}
