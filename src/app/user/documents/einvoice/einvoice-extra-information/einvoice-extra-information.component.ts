import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { ExtraField, ExtraFieldsParams, ExtraFieldsDto } from "@helper/abstraction/extra-fields";
import { Subject, Subscription, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EinvoiceFormBuilderService } from "../services/einvoice-form-builder.service";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";

export interface ExtraFieldForm {
	// dictionary: ExtraField;
	fieldName: string;
	fieldCode: string;
	fieldValue: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-extra-information",
	styleUrls: ["./einvoice-extra-information.component.scss", "../einvoice-section.scss"],
	templateUrl: "./einvoice-extra-information.component.html"
})

export class EinvoiceExtraInformationComponent implements OnInit, OnDestroy {
	@Input() public form?: FormGroup;
	public showContent = true;
	public showAdding = false;

	public dictionaryOption: any = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ExtraFieldsDto> => {
			const params: ExtraFieldsParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.extraFields.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, `${e.fieldCode} ${e.fieldName}`]),
	};
	private unsubscribe$$: Subject<void> = new Subject<void>();
	private lastExtraField?: Subscription;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private einvoiceFormBuilderService: EinvoiceFormBuilderService,
		private userBackendService: UserBackendService
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
			this.extraFields.push(this.einvoiceFormBuilderService.getExtraFieldForm(initValue));
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
}
