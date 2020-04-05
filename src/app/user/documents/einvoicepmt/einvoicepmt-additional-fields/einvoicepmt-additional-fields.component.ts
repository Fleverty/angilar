import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { AbstractControl, FormArray, FormGroup } from "@angular/forms";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EinvoicepmtFormBuilderService } from "@app/user/documents/einvoicepmt/einvoicepmt-form-builder.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { CurrenciesParams } from "@helper/abstraction/currency";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

export interface ExtraFieldForm {
	// dictionary: ExtraField;
	fieldName: string;
	fieldCode: string;
	fieldValue: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-additional-fields",
	templateUrl: "./einvoicepmt-additional-fields.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-additional-fields.component.scss"]
})
export class EinvoicepmtAdditionalFieldsComponent {
	@Input() public form?: FormGroup;
	@Input() public extraFieldsList: [ExtraField, string][] = [];
	@Output() public appExtraFieldsFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() public appAddExtraField: EventEmitter<void> = new EventEmitter<void>();
	public showContent = true;
	public showAdding = false;

	public additionalFieldsSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ExtraField[]> => {
			const params: CurrenciesParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.extraFields.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.fieldName]),
	};

	private unsubscribe$$: Subject<void> = new Subject<void>();
	private lastExtraField?: Subscription;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private einvoicepmtFormBuilderService: EinvoicepmtFormBuilderService,
		private readonly userBackendService: UserBackendService
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
		return this.form.controls.fields as FormArray;
	}

	public removeDocument(index: number): void {
		this.documents.removeAt(index);
	}

	public addExtraField(initValue?: ExtraFieldForm): void {
		let lastIndex = this.extraFields.length - 1;
		if (lastIndex === -1 || this.extraFields.at(lastIndex).valid) {
			if (this.lastExtraField)
				this.lastExtraField.unsubscribe();
			this.extraFields.push(this.einvoicepmtFormBuilderService.getEinvoicepmtAdditionalFieldForm(initValue));
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
		return this.form.controls.fields as FormArray;
	}

	public extraFieldsNextPage(): void {
		this.appExtraFieldsFilterChanges.emit();
	}

	public onExtraFieldsFilterChanges(extraFieldName: { search: string }): void {
		this.appExtraFieldsFilterChanges.emit(extraFieldName.search);
	}
}
