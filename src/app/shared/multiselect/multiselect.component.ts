import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
	ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnDestroy, Output, Type, OnChanges, SimpleChanges, ChangeDetectorRef
} from "@angular/core";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { TemplateUtil } from "@helper/template-util";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";
import { Shipper } from "@helper/abstraction/statistic";

export interface MultiSelectFormValue {
	organizations?: Shipper[];
	gln?: string;
	address?: string;
}

export interface AddressesValue {
	checked: boolean;
	dto: Shipper;
	text: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-multiselect",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<MultiSelectComponent> => MultiSelectComponent)
	}],
	styleUrls: ["./multiselect.component.scss"],
	templateUrl: "./multiselect.component.html",
})

export class MultiSelectComponent extends BoxValueAccessor implements OnDestroy, OnChanges {
	@Input() public title = "";
	@Input() public placeholder = "";
	@Input() public data: [any, string][] | HTMLElement = [];
	@Input() public organization: [Shipper, string][] = [];
	@Input() public filterValue?: MultiSelectFormValue;
	@Input() public valueTransformFn?: (value: any) => string;
	@Output() public organizationFilter: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();
	@Output() public appUpdateCriterionsFilter: EventEmitter<MultiSelectFormValue> = new EventEmitter<MultiSelectFormValue>();
	@Output() public appOnScroll: EventEmitter<MultiSelectFormValue> = new EventEmitter<MultiSelectFormValue>();
	@Output() public appOnClosePopup: EventEmitter<void> = new EventEmitter<void>();
	public isPopupDisplay = false;
	public addresses: AddressesValue[] = [];
	public searchCriterion: FormGroup;
	public showedValue: any[] = [];
	private formChanges?: Subscription;
	private templateUtil = TemplateUtil;

	constructor(
		private fb: FormBuilder,
		private changeDetectorRef: ChangeDetectorRef
	) {
		super();
		if (!this.value) {
			this.value = [];
		}
		this.searchCriterion = this.fb.group({
			organizations: null,
			gln: [null, Validators.pattern(/^\d+$/)],
			address: null,
		});
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.data) {
			this.updateData();

			if (this.value && this.value.length && this.addresses) {
				this.addresses.reduce((prev, curr) => {
					if (this.value.find((el: Shipper) => el.id === curr.dto.id)) {
						curr.checked = true;
					}
					return prev;
				}, []);
			}
		}
	}

	public ngOnDestroy(): void {
		if (this.formChanges)
			this.formChanges.unsubscribe();
	}

	public get countOfChecked(): number {
		return this.addresses.filter((el: { [key: string]: any }): boolean => el.checked).length;
	}

	public updateOrganizationFilter(organization: { search?: string }): void {
		this.organizationFilter.emit(organization.search);
	}

	public updateData(): void {
		this.addresses = [];
		if (this.data instanceof HTMLElement) {
			this.templateUtil.getArray(this.data as HTMLElement).forEach((el: [any, string]): void => {
				this.addresses.push({
					checked: false,
					dto: el[0],
					text: el[1],
				});
			});
		} else if (Array.isArray(this.data)) {
			this.data.forEach((el: [any, string]): void => {
				this.addresses.push({
					checked: false,
					dto: el[0],
					text: el[1],
				});
			});
		} else {
			throw Error("Missing type");
		}

	}

	public deleteItem(index: number): void {
		this.value.splice(index, 1);
		this.showedValue.splice(index, 1);
		if (this.onChange)
			this.onChange(this.value);
		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}

	public openPopup(isOpen: boolean): void {
		this.isPopupDisplay = isOpen;
		if (this.isPopupDisplay) {
			this.searchCriterion.patchValue({
				organizations: this.filterValue && this.filterValue.organizations,
				gln: this.filterValue && this.filterValue.gln,
				address: this.filterValue && this.filterValue.address,
			});

			this.appUpdateCriterionsFilter.emit(this.searchCriterion.getRawValue());

			this.formChanges = this.searchCriterion.valueChanges.pipe(debounceTime(500)).subscribe((data: MultiSelectFormValue): void => {
				this.appUpdateCriterionsFilter.emit(data);
			});
		} else {
			this.appOnClosePopup.emit();
			this.formChanges && this.formChanges.unsubscribe();
		}
	}


	public writeValue(value: any): void {
		if (!value && this.searchCriterion) {
			this.searchCriterion.reset();
		}
		this.value = value;

		if (this.onChange)
			this.onChange(this.value);
		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}

	public save(): void {
		this.value = [];
		this.addresses.forEach((el: AddressesValue): void => {
			if (el.checked) {
				this.value.push(el.dto);
				this.showedValue.push(el.text);
			}
		});

		if (this.onChange)
			this.onChange(this.value);
		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
		this.openPopup(false);
	}

	public onScroll(scrollHeight: number, scrollTop: number, height: number): void {
		if (scrollTop + height >= scrollHeight) {
			this.appOnScroll.emit();
		}
	}

	public transformFn(organization: Shipper): string {
		return organization.name;
	}
}
