import { resetUnitOfMeasures, updateUnitOfMeasuresFilter, resetCountries, updateCountriesFilter } from "../ewaybill.actions";
import { EwaybillProduct } from "@helper/abstraction/ewaybill";
import { EwaybillState } from "../ewaybill.reducer";
import { Observable, Subject } from "rxjs";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { UnitOfMeasuresParams, UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { takeUntil } from "rxjs/operators";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { TemplateUtil } from "@helper/template-util";
import { Big } from "big.js";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { OverlayService } from "@core/overlay.service";
import { DraftType } from "@helper/abstraction/draft";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserState } from "@app/user/user.reducer";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";

@Component({
	selector: "app-ewaybill-product-popup",
	templateUrl: "./ewaybill-product-popup.component.html",
	styleUrls: ["./ewaybill-product-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EwaybillProductPopupComponent extends DefaultPopupComponent implements OnDestroy, OnChanges {
	@Input() public form?: FormGroup;
	@Input() public formArrays?: FormArray;
	@Input() public position?: number;
	@Input() public mode: "CREATE" | "EDIT" = "CREATE";
	@Input() public messageType?: DraftType;
	public rounding = true;
	public unitOfMeasuresFilter: UnitOfMeasuresParams = {
		page: 0,
		size: 30,
	};
	public countriesFilter: CountriesParams = {
		page: 0,
		size: 30,
	};
	public unitOfMeasures$: Observable<[UnitOfMeasure, string][]>;
	public countries$: Observable<[Country, string][]>;
	@ViewChild("popupMessage", { static: true }) private popupMessage?: ElementRef<HTMLTemplateElement>;
	private messages: Map<string, string> = new Map<string, string>();
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private overlayService: OverlayService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private userFilterService: UserFilterService<UserState>,
		private ewaybillSelectorService: EwaybillSelectorService,
		private readonly userErrorsService: UserErrorsService
	) {
		super();
		this.unitOfMeasures$ = this.ewaybillSelectorService.selectDictionariesFromStore$<UnitOfMeasure>(
			(uom: UnitOfMeasure): string => `${uom.name}`,
			(state: EwaybillState): UnitOfMeasure[] | undefined => state.unitOfMeasures
		).pipe(takeUntil(this.unsubscribe$$));

		this.countries$ = this.ewaybillSelectorService.selectDictionariesFromStore$<Country>(
			(country: Country): string => `${country.name}`,
			(state: EwaybillState): Country[] | undefined => state.countries
		).pipe(takeUntil(this.unsubscribe$$));
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.form) {
			this.updateUnitOfMeasuresFilter({ search: "" });
			this.updateCountriesFilter({ search: "" });
			if (typeof this.position === "number" && this.form)
				this.form.patchValue({ position: this.position });

			this.form && this.form.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe((value: EwaybillProduct): void => {
				if (this.rounding) {
					this.changeTotal(value);
				}
			});
		}
	}

	public ngAfterViewInit(): void {
		if (!this.popupMessage)
			throw Error("no popupMessage");
		this.messages = TemplateUtil.getMap(this.popupMessage.nativeElement);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public get documentsInformation(): FormArray {
		if (!this.form)
			throw Error("No formProduct");
		return this.form.get("msgEwaybillItemCertList") as FormArray;
	}

	public get typesTransportation(): FormArray {
		if (!this.form)
			throw Error("No formProduct");
		return this.form.get("msgEwaybillExtraFieldList") as FormArray;
	}

	public deleteDocumentInformation(i: number): void {
		this.documentsInformation.removeAt(i);
	}

	public deleteTypeTransportation(i: number): void {
		this.typesTransportation.removeAt(i);
	}

	public clickRounding(flag: boolean, value: EwaybillProduct): void {
		this.rounding = flag;
		this.changeTotal(value);
		this.changeDetectorRef.detectChanges();
	}

	public cancel(): void {
		this.close();
	}

	public updateUnitOfMeasuresFilter(uomName: { search?: string }): void {
		this.userFilterService.updateFilter(this.unitOfMeasuresFilter, resetUnitOfMeasures, updateUnitOfMeasuresFilter, uomName.search);
	}

	public updateCountriesFilter(country: { search?: string }): void {
		this.userFilterService.updateFilter(this.countriesFilter, resetCountries, updateCountriesFilter, country.search);
	}

	public tranformFn(value: { id: string; name: string }): [any, string] {
		return [value, value.name];
	}

	public save(form: FormGroup): void {
		const isTwoStars = form.value.gtin || form.value.codeByBuyer || form.value.codeBySupplier;
		ValidatorsUtil.triggerValidation(form);
		if (!form || form.invalid || !isTwoStars) {
			if (!isTwoStars) {
				const m = this.messages.get("text");
				if (!m) throw Error("No message");
				this.overlayService && this.overlayService.showNotification$(m, "error");
			}
			this.userErrorsService.displayErrors(form);
			return;
		}

		this.markAsTouched(form);
		this.formArrays && this.formArrays.push(form);
		this.close();
	}

	public edit(form: FormGroup): void {
		if (!form || !this.formArrays)
			throw Error("No full EwaybillProductsPopup inputs");

		if (typeof this.position !== "number")
			throw Error("Don't have position number!");

		const isTwoStars = form.value.gtin || form.value.codeByBuyer || form.value.codeBySupplier;
		if (form.invalid || !isTwoStars) {
			if (!isTwoStars) {
				const m = this.messages.get("text");
				if (!m) throw Error("No message");
				this.overlayService && this.overlayService.showNotification$(m, "error");
			}
			this.userErrorsService.displayErrors(form);
			return;
		}

		this.markAsTouched(form);
		this.formArrays.removeAt(this.position - 1);
		this.formArrays.insert(this.position - 1, form);
		this.close();
	}

	public markAsTouched(form: FormGroup): void {
		form.markAllAsTouched();
		form.patchValue({});
		// form.setValue(form.value); // initiator detect changes
	}

	private changeTotal(data?: EwaybillProduct): void {
		if (!this.form)
			throw Error("No formProduct");
		if (!data) {
			data = this.form.value;
		} else if (this.rounding) {
			if (data.quantityDespatch && data.priceNet) {
				const amountWithoutVat: Big = new Big(data.priceNet || 0).times(new Big(data.quantityDespatch)).round(2);
				const amountVat: Big = data.vatRate ? amountWithoutVat.times(data.vatRate).div(100).round(2) : new Big(0);
				const amountWithVat: Big = amountWithoutVat.plus(amountVat);
				this.form.patchValue({ amountWithoutVat: amountWithoutVat.toFixed(2), amountVat: amountVat.toFixed(2), amountWithVat: amountWithVat.toFixed(2) }, { emitEvent: false });
			} else {
				this.form.patchValue({ amountVat: 0, amountWithVat: 0, amountWithoutVat: 0 }, { emitEvent: false });
			}
		}
	}
}
