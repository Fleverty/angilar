import { Component, ChangeDetectionStrategy, Input, SimpleChanges } from "@angular/core";
import { FormArray, FormGroup, Validators, FormControl } from "@angular/forms";
import { Observable, Subject, Subscription } from "rxjs";
import { ProductExtraField, ProductExtraFieldsParams, ExtraField } from "@helper/abstraction/extra-fields";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { EinvoiceFormBuilderService } from "../services/einvoice-form-builder.service";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { EinvoiceState } from "../einvoice.reducer";
import * as EinvoiceMainActions from "../../einvoice/einvoice-actions/einvoice-main.actions";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-einvoice-product-additional-fields",
	templateUrl: "./einvoice-product-additional-fields.component.html",
	styleUrls: ["./einvoice-product-additional-fields.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceProductAdditionalFieldsComponent {
	@Input() public formArray?: FormArray;

	public extraFields$: Observable<[ProductExtraField, string][]>;
	public extraFieldsFilter: ProductExtraFieldsParams = { page: 0, size: 30 };
	public unsubscribe$$ = new Subject<void>();
	public subscriptions: Subscription[] = [];
	public dictionarySubscriptions: Subscription[] = [];
	private lastExtraField?: Subscription;

	constructor(
		private readonly einvoiceFormBuilderService: EinvoiceFormBuilderService,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
		private readonly userFilterService: UserFilterService<EinvoiceState>
	) {
		this.extraFields$ = this.einvoiceSelectorService.selectDictionariesFromStore$<ProductExtraField>(
			(extraField: ProductExtraField): string => `${extraField.fieldCode} ${extraField.fieldName}`,
			(state: EinvoiceState): ProductExtraField[] | undefined => state.productExtraFields
		);
	}

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
			this.updateExtraFieldsFilter("");
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
			this.formArray.push(this.einvoiceFormBuilderService.getAdditionalFieldsOnProductForm());
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

	public updateExtraFieldsFilter(searchText?: string): void {
		this.userFilterService.updateFilter(this.extraFieldsFilter, EinvoiceMainActions.resetProductExtraFields, EinvoiceMainActions.updateProductExtraFieldsFilter, searchText);
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
