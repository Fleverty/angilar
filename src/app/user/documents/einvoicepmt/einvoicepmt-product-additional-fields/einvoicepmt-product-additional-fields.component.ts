import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, Subscription } from "rxjs";
import { ProductExtraField, ProductExtraFieldDto, ProductExtraFieldsParams } from "@helper/abstraction/extra-fields";
import { EinvoicepmtFormBuilderService } from "@app/user/documents/einvoicepmt/einvoicepmt-form-builder.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-product-additional-fields",
	templateUrl: "./einvoicepmt-product-additional-fields.component.html",
	styleUrls: ["./einvoicepmt-product-additional-fields.component.scss"]
})
export class EinvoicepmtProductAdditionalFieldsComponent {
	@Input() public formArray?: FormArray;

	public unsubscribe$$ = new Subject<void>();
	public subscriptions: Subscription[] = [];
	public dictionarySubscriptions: Subscription[] = [];
	public itemExtraFieldsSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ProductExtraFieldDto> => {
			const params: ProductExtraFieldsParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.item.extraFields.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.fieldName || null]),
	};

	constructor(
		private readonly einvoicepmtFormBuilderService: EinvoicepmtFormBuilderService,
		private readonly userBackendService: UserBackendService
	) { }

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.formArray) {
			const array = simpleChanges.formArray.currentValue as FormArray;
			this.trackSubFormValue(...(array.controls as FormGroup[]));
		}
	}

	public clearAllDocs(): void {
		this.formArray && this.formArray.clear();
	}

	public addDocument(): void {
		if (this.formArray && ((this.formArray.at(this.formArray.length - 1) && this.formArray.at(this.formArray.length - 1).valid) || !this.formArray.length)) {
			const subForm = this.einvoicepmtFormBuilderService.getEinvoicepmtAdditionalFieldsOnProductForm();
			this.trackSubFormValue(subForm);
			this.formArray.push(subForm);
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
						fieldName: dictionary.fieldName || null,
						fieldCode: dictionary.fieldCode || null
					});
				}
			}))
		);
	}
}
