import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-marks-acts",
	styleUrls: ["../ewaybill-default-component.scss", "./ewaybill-marks-acts.component.scss"],
	templateUrl: "./ewaybill-marks-acts.component.html"
})

export class EwaybillMarksActsComponents {
	@Input() public form?: FormGroup;
	@Input() public isSaveClicked = false;
	@Input() public isAddClicked = false;
	@Output() public appAddDocument: EventEmitter<void> = new EventEmitter<void>();
	public showContent = true;
	public showAdding = false;

	public clearAllDocs(): void {
		this.showAdding = false;
		this.form && (this.form.get("documents") as FormArray).clear();
	}

	public get documents(): FormArray | undefined {
		return this.form && this.form.get("documents") as FormArray;
	}

	public removeDocument(index: number): void {
		this.form && (this.form.get("documents") as FormArray).removeAt(index);
	}
}
