import { Component, ChangeDetectionStrategy, Input, SimpleChanges } from "@angular/core";
import { FormArray, FormGroup, Validators, FormControl } from "@angular/forms";
import { Observable, Subject, Subscription } from "rxjs";
import { ProductExtraField, ExtraField, ExtraFieldsDto, ExtraFieldsParams } from "@helper/abstraction/extra-fields";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { EwaybillFormBuilderService } from "../ewaybill/ewaybill-form-builder.service";
import { takeUntil } from "rxjs/operators";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

@Component({
	selector: "app-ewaybill-product-additional-fields",
	templateUrl: "./ewaybill-product-additional-fields.component.html",
	styleUrls: ["./ewaybill-product-additional-fields.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillProductAdditionalFieldsComponent {
	@Input() public formArray?: FormArray;

	public unsubscribe$$ = new Subject<void>();
	public subscriptions: Subscription[] = [];
	public dictionarySubscriptions: Subscription[] = [];
	public extraFieldOption: any = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ExtraFieldsDto> => {
			const params: ExtraFieldsParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.extraFields.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, ` ${e.fieldCode || ""} ${e.fieldName || ""}`]),
	};
	private lastExtraField?: Subscription;

	constructor(
		private readonly ewaybillFormBuilderService: EwaybillFormBuilderService,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly userBackendService: UserBackendService
	) { }

	public ngOnInit(): void {
		if (this.formArray && this.formArray.length > 0) {
			(this.formArray.at(this.formArray.length - 1) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.formArray && this.formArray.at(this.formArray.length - 1).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
		}
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.formArray) {
			const array = simpleChanges.formArray.currentValue as FormArray;
			if (array.length)
				this.trackSubFormValue(...(array.controls as FormGroup[]));
		}
	}

	public addDocument(): void {
		if (!this.formArray)
			throw Error("No form");
		let lastIndex = this.formArray.length - 1;
		if (lastIndex === -1 || this.formArray.at(lastIndex).valid) {
			if (this.lastExtraField)
				this.lastExtraField.unsubscribe();
			this.formArray.push(this.ewaybillFormBuilderService.getAdditionalFieldsOnProductForm());
			lastIndex++;
			this.lastExtraField = (this.formArray.at(lastIndex) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.formArray && this.formArray.at(this.formArray.length - 1).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
		}
	}

	public removeDocumentAt(i: number): void {
		if (this.formArray) {
			this.formArray.removeAt(i);
			if (this.subscriptions.length)
				this.subscriptions.splice(i, 1)[0].unsubscribe(); // change this.subsctiptions
		}
	}

	public ngOnDestroy(): void {
		this.dictionarySubscriptions.forEach(s => s.unsubscribe());
		this.subscriptions.forEach(s => s.unsubscribe());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public tranformFn(value: { id: string; fieldCode: string; fieldName: string }): [any, string] {
		return [value, ` ${value.fieldCode || ""} ${value.fieldName || ""}`];
	}

	public clearAllDocs(): void {
		this.formArray && this.formArray.clear();
	}

	private trackSubFormValue(...subForms: FormGroup[]): void {
		this.subscriptions.push(
			...subForms.map(subForm => subForm.valueChanges.subscribe(formValue => {
				const isAllNull = Object.keys(formValue).every(key => !formValue[key]);
				[subForm.get("fieldName"), subForm.get("fieldValue"), subForm.get("fieldCode")].forEach(control => {
					if (control) {
						isAllNull ? control.clearValidators() : control.setValidators(Validators.required);
						control.updateValueAndValidity({ emitEvent: false });
					}
				});
			}))
		);

		this.dictionarySubscriptions.push(
			...subForms.map(subForm => (subForm.get("dictionary") as FormControl).valueChanges.subscribe((dictionary: ProductExtraField) => {
				if (dictionary) {
					subForm.patchValue({
						fieldName: dictionary.fieldName,
						fieldCode: dictionary.fieldCode
					});
				}
			}))
		);
	}
}
