import { EinvoiceProduct } from "@helper/abstraction/einvoice";
import { EinvoiceState } from "../einvoice.reducer";
import { Observable, Subject } from "rxjs";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { UnitOfMeasuresParams, UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { takeUntil } from "rxjs/operators";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { ProductExtraField } from "@helper/abstraction/extra-fields";
import { TemplateUtil } from "@helper/template-util";
import { Big } from "big.js";
import { EinvoiceService } from "../services/einvoice.service";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { OverlayService } from "@core/overlay.service";
import { DraftType } from "@helper/abstraction/draft";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import * as EinvoiceMainActions from "../../einvoice/einvoice-actions/einvoice-main.actions";

@Component({
	selector: "app-einvoice-product-popup",
	templateUrl: "./einvoice-product-popup.component.html",
	styleUrls: ["./einvoice-product-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EinvoiceProductPopupComponent extends DefaultPopupComponent implements OnDestroy, OnChanges {
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
		private readonly userErrorsService: UserErrorsService,
		private overlayService: OverlayService,
		private formBuilder: FormBuilder,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private einvoiceService: EinvoiceService,
		private einvoiceSelectorService: EinvoiceSelectorService
	) {
		super();

		this.unitOfMeasures$ = this.einvoiceSelectorService.selectDictionariesFromStore$<UnitOfMeasure>(
			(uom: UnitOfMeasure): string => `${uom.name}`,
			(state: EinvoiceState): UnitOfMeasure[] | undefined => state.unitOfMeasures
		);

		this.countries$ = this.einvoiceSelectorService.selectDictionariesFromStore$<Country>(
			(country: Country): string => `${country.name}`,
			(state: EinvoiceState): Country[] | undefined => state.countries
		);
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.form) {
			this.updateUnitOfMeasuresFilter({ search: "" });
			this.updateCountriesFilter({ search: "" });

			if (typeof this.position === "number" && this.form)
				this.form.patchValue({ position: this.position });

			this.form && this.form.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe((value: EinvoiceProduct): void => {
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

	public addDocumentInformation(): void {
		this.documentsInformation.push(this.formBuilder.group({
			name: [null, Validators.required],
			number: [null, Validators.required],
			dateFrom: [null],
			dateTo: [null],
			issuedBy: [null],
		}));
	}

	public addTypeTransportation(): void {
		const fg = this.formBuilder.group({
			dictionary: [null],
			fieldName: [null, Validators.required],
			fieldValue: [null, Validators.required],
			fieldCode: [null, Validators.required]
		});
		this.typesTransportation.push(fg);

		fg.controls.dictionary.valueChanges.pipe(
			takeUntil(this.unsubscribe$$),
		).subscribe((value: ProductExtraField) => {
			if (value) {
				fg.patchValue({
					fieldName: value.fieldName,
					fieldCode: value.fieldCode
				});
			}
		});
	}

	public get documentsInformation(): FormArray {
		if (!this.form)
			throw Error("No formProduct");
		return this.form.get("msgEinvoiceItemCertList") as FormArray;
	}

	public get typesTransportation(): FormArray {
		if (!this.form)
			throw Error("No formProduct");
		return this.form.get("einvoiceItemExtraFieldList") as FormArray;
	}

	public deleteDocumentInformation(i: number): void {
		this.documentsInformation.removeAt(i);
	}

	public deleteTypeTransportation(i: number): void {
		this.typesTransportation.removeAt(i);
	}

	public clickRounding(flag: boolean, value: EinvoiceProduct): void {
		this.rounding = flag;
		this.changeTotal(value);
		this.changeDetectorRef.detectChanges();
	}

	public cancel(): void {
		this.close();
	}

	public updateUnitOfMeasuresFilter(uomName: { search?: string }): void {
		this.einvoiceService.updateFilter(this.unitOfMeasuresFilter, EinvoiceMainActions.resetUnitOfMeasures, EinvoiceMainActions.updateUnitOfMeasuresFilter, uomName.search);
	}

	public updateCountriesFilter(country: { search?: string }): void {
		this.einvoiceService.updateFilter(this.countriesFilter, EinvoiceMainActions.resetCountries, EinvoiceMainActions.updateCountriesFilter, country.search);
	}

	public transformFn(value: { id: string; name: string }): [any, string] {
		return [value, value.name];
	}

	public isPristine(form: FormGroup): void {
		if (form && form.get("msgEinvoiceItemCertList") && (form.get("msgEinvoiceItemCertList") as FormArray).pristine)
			(form.get("msgEinvoiceItemCertList") as FormArray).clear();

		if (form && form.get("einvoiceItemExtraFieldList") && (form.get("einvoiceItemExtraFieldList") as FormArray).pristine)
			(form.get("einvoiceItemExtraFieldList") as FormArray).clear();
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
	}

	private changeTotal(data?: EinvoiceProduct): void {
		if (!this.form)
			throw Error("No formProduct");
		if (!data) {
			data = this.form.value;
		} else if (this.rounding) {
			if (data.quantity && data.priceNet) {
				const amountWithoutVat: Big = new Big(data.priceNet || 0).times(new Big(data.quantity)).round(2);
				const amountVat: Big = data.vatRate ? amountWithoutVat.times(data.vatRate).div(100).round(2) : new Big(0);
				const amountWithVat: Big = amountWithoutVat.plus(amountVat);
				this.form.patchValue({ amountWithoutVat, amountVat, amountWithVat }, { emitEvent: false });
			} else {
				this.form.patchValue({ amountVat: 0, amountWithVat: 0, amountWithoutVat: 0 }, { emitEvent: false });
			}
		}
	}
}
