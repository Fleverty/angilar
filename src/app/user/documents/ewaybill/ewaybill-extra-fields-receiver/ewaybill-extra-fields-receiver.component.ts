import {
	Component,
	ChangeDetectionStrategy,
	Input,
	OnInit,
	EventEmitter,
	Output,
	OnDestroy,
	OnChanges, SimpleChanges
} from "@angular/core";
import { FormGroup, FormArray, AbstractControl } from "@angular/forms";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-extra-fields-receiver",
	styleUrls: ["./ewaybill-extra-fields-receiver.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-extra-fields-receiver.component.html"
})

export class EwaybillExtraFieldsReceiverComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public form?: FormGroup;
	@Input() public extraFields: [ExtraField, string][] = [];
	@Input() public isAddClicked = false;
	@Output() public appExtraFieldsFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() public appAddExtraField: EventEmitter<void> = new EventEmitter<void>();
	public showContent = true;
	public showAdding = false;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	public ngOnInit(): void {
		if (this.documents && this.documents.length > 0) {
			(this.documents.at(this.documents.length - 1) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.documents && this.documents.at(this.documents.length - 1).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.extraFields && changes.extraFields.currentValue && changes.extraFields.currentValue.length)
			this.documents && this.documents.controls.forEach((e: AbstractControl) => {
				const value = this.extraFields.find((field: [ExtraField, string]) => field[0].fieldCode === e.value.fieldCode);
				if (value)
					e.patchValue({ dictionary: value[0] });
			});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public clearAllDocs(): void {
		this.documents && this.documents.clear();
		this.unsubscribe$$.next();
		this.showAdding = false;
	}

	public get documents(): FormArray | undefined {
		return this.form && this.form.controls.documents as FormArray;
	}

	public removeDocument(index: number): void {
		this.form && (this.form.controls.documents as FormArray).removeAt(index);
	}

	public extraFieldsNextPage(): void {
		this.appExtraFieldsFilterChanges.emit();
	}

	public onExtraFieldsFilterChanges(extraFieldName: { search: string }): void {
		this.appExtraFieldsFilterChanges.emit(extraFieldName.search);
	}
}	
