import {
	Component,
	ChangeDetectionStrategy,
	Input,
	OnInit,
	EventEmitter,
	Output,
	OnDestroy,
	ChangeDetectorRef,
	OnChanges, SimpleChanges
} from "@angular/core";
import { FormGroup, FormArray, AbstractControl } from "@angular/forms";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EwaybillFormBuilderService } from "../ewaybill/ewaybill-form-builder.service";

export interface ExtraFieldForm {
	// dictionary: ExtraField;
	fieldName: string;
	fieldCode: string;
	fieldValue: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-extra-information",
	styleUrls: ["./ewaybill-extra-information.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-extra-information.component.html"
})

export class EwaybillExtraInformationComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public form?: FormGroup;
	@Input() public extraFieldsList: [ExtraField, string][] = [];
	@Output() public appExtraFieldsFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() public appAddExtraField: EventEmitter<void> = new EventEmitter<void>();
	public showContent = true;
	public showAdding = false;
	private unsubscribe$$: Subject<void> = new Subject<void>();
	private lastExtraField?: Subscription;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private ewaybillFormBuilderService: EwaybillFormBuilderService
	) { }

	public ngOnInit(): void {
		if (this.form && this.documents.length > 0) {
			(this.documents.at(this.documents.length - 1) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.documents.at(this.documents.length - 1).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.extraFieldsList && changes.extraFieldsList.currentValue) {
			this.documents.controls.forEach((control: AbstractControl) => {
				const selectedValue = changes.extraFieldsList.currentValue.find((e: [{ fieldCode: string }, string]) => e[0].fieldCode === control.value.fieldCode);
				if (selectedValue && selectedValue.length)
					(control.get("dictionary") as AbstractControl).patchValue(selectedValue[0], { emitEvent: false });
				else if (control.value.fieldName)
					(control.get("dictionary") as AbstractControl).patchValue(control.value.fieldName, { emitEvent: false });
			});
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public clearAllDocs(): void {
		this.documents.clear();
		this.unsubscribe$$.next();
		this.showAdding = false;
	}

	public get documents(): FormArray {
		if (!this.form)
			throw Error("No form");
		return this.form.controls.documents as FormArray;
	}

	public removeDocument(index: number): void {
		this.documents.removeAt(index);
	}

	public addExtraField(initValue?: ExtraFieldForm): void {
		let lastIndex = this.extraFields.length - 1;
		if (lastIndex === -1 || this.extraFields.at(lastIndex).valid) {
			if (this.lastExtraField)
				this.lastExtraField.unsubscribe();
			this.extraFields.push(this.ewaybillFormBuilderService.getExtraFieldForm(initValue));
			lastIndex++;
			this.lastExtraField = (this.extraFields.at(lastIndex) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.extraFields.at(this.extraFields.length - 1).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
			this.changeDetectorRef.detectChanges();
		}
	}

	public get extraFields(): FormArray {
		if (!this.form)
			throw Error("No form");
		return this.form.controls.documents as FormArray;
	}

	public extraFieldsNextPage(): void {
		this.appExtraFieldsFilterChanges.emit();
	}

	public onExtraFieldsFilterChanges(extraFieldName: { search: string }): void {
		this.appExtraFieldsFilterChanges.emit(extraFieldName.search);
	}
}
