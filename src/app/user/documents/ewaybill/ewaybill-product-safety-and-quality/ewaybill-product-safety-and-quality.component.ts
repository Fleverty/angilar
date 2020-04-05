import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from "@angular/core";
import { FormArray, Validators, FormGroup } from "@angular/forms";
import { EwaybillFormBuilderService } from "@app/user/documents/ewaybill/ewaybill/ewaybill-form-builder.service";
import { Observable, Subscription, Subject } from "rxjs";
import { Certificate, CertificateParams, CertificatesDto } from "@helper/abstraction/certificate";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

@Component({
	selector: "app-ewaybill-product-safety-and-quality",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./ewaybill-product-safety-and-quality.component.html",
	styleUrls: ["./ewaybill-product-safety-and-quality.component.scss"]
})
export class EwaybillProductSafetyAndQualityComponent {
	@Input() public formArray?: FormArray;
	@Input() public documentTypes?: [Certificate, string][] = [];
	public subscriptions: Subscription[] = [];
	public documentTypesOption: any = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<CertificatesDto> => {
			const params: CertificateParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.certificates.types.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.nameFull]),
	};
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly ewaybillFormBuilderService: EwaybillFormBuilderService,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly userBackendService: UserBackendService
	) { }

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

		const lastIndex = this.formArray.length - 1;
		if (lastIndex === -1 || this.formArray.at(lastIndex).valid) {
			const subForm = this.ewaybillFormBuilderService.getDocumentInformationOnProductForm();
			this.trackSubFormValue(subForm);
			this.formArray.push(subForm);
		}
	}

	public removeDocumentAt(i: number): void {
		if (this.formArray) {
			this.formArray.removeAt(i);
			this.subscriptions.splice(i, 1)[0].unsubscribe(); // change this.subsctiptions
		}
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public tranformFn(value: { id: string; code: string; nameFull: string }): [any, string] {
		return [value, value.nameFull];
	}

	public clearAllDocs(): void {
		this.formArray && this.formArray.clear();
	}

	private trackSubFormValue(...subForms: FormGroup[]): void {
		this.subscriptions.push(
			...subForms.map(subForm => subForm.valueChanges.subscribe(formValue => {
				const isAllNull = Object.keys(formValue).every(key => !formValue[key]);
				[subForm.get("certType"), subForm.get("certNumber")].forEach(control => {
					if (control) {
						isAllNull ? control.clearValidators() : control.setValidators(Validators.required);
						control.updateValueAndValidity({ emitEvent: false });
					}
				});
			}))
		);
	}
}
