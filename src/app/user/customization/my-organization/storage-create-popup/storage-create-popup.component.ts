import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { CustomizationState } from "../../customization.reducer";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { resetCountries, updateCountriesFilter, resetRegions, updateRegionsFilter, updateStreetsFilter, resetStreets, saveStorage } from "../../customization.actions";
import { RegionsParams, Region } from "@helper/abstraction/regions";
import { notNull } from "@helper/operators";
import { takeUntil } from "rxjs/operators";
import { StreetsParams, Street } from "@helper/abstraction/streets";
import { TemplateUtil } from "@helper/template-util";
import { ValidatorsUtil } from "@helper/validators-util";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { CustomizationSelectorService } from "../../customization-selector.service";
import { CustomizationFilterService } from "../../customization-filter.service";
import { StorageCreate } from "@helper/abstraction/storages";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
	selector: "app-storage-create-popup",
	templateUrl: "./storage-create-popup.component.html",
	styleUrls: ["./storage-create-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageCreatePopupComponent extends DefaultPopupComponent implements OnInit {
	public form?: FormGroup;
	public countries$: Observable<[Country, string][] | undefined>;
	public regions$: Observable<[Region, string][] | undefined>;
	public streets$: Observable<[Street, string][] | undefined>;
	@ViewChild("messagesErrors", { static: true }) public messagesErrors?: ElementRef<HTMLTemplateElement>;
	public messages?: Map<string, string>;
	public errorMessages?: Record<string, string[]>;
	public storageError$: Observable<HttpErrorResponse | undefined>;
	public otherStorageError$: Observable<Error | undefined>;
	public isChangeStorage$: Observable<boolean | undefined>;
	public streetsFilter: StreetsParams = {
		page: 1,
		size: 20
	};
	public countriesFilter: CountriesParams = {
		page: 1,
		size: 20
	};
	public regionsFilter: RegionsParams = {
		page: 1,
		size: 20
	};
	@ViewChild("notification", { static: false }) private overlayComponent?: OverlayComponent;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly store: Store<CustomizationState>,
		private formBuilder: FormBuilder,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly customizationSelectorService: CustomizationSelectorService,
		private readonly customizationFilterService: CustomizationFilterService
	) {
		super();

		this.countries$ = this.customizationSelectorService.selectDictionariesFromStore$<Country>(
			country => country.name,
			state => state.countries
		);

		this.regions$ = this.customizationSelectorService.selectDictionariesFromStore$<Region>(
			region => region.name,
			state => state.regions
		);

		this.streets$ = this.customizationSelectorService.selectDictionariesFromStore$<Street>(
			street => street.name,
			state => state.streets
		);

		this.storageError$ = this.customizationSelectorService.select$<HttpErrorResponse | undefined>(state => state.storageErrors);

		this.otherStorageError$ = this.customizationSelectorService.select$<Error | undefined>(state => state.otherStorageError);

		this.isChangeStorage$ = this.customizationSelectorService.select$<boolean | undefined>(state => state.isChangeStorage);

		this.updateStreetsFilter("");
		this.updateRegionsFilter("");
		this.updateCountriesFilter("");
	}

	public ngOnInit(): void {
		this.initForm();

		this.storageError$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(messages => {
			this.overlayComponent && this.overlayComponent.showNotification$(messages && messages.error, "error");
		});

		this.otherStorageError$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(error => {
			if (!this.messages || this.messages && !this.messages.get("serverErr"))
				throw new Error("No messages errors!");

			this.overlayComponent && this.overlayComponent.showNotification$(error.message || this.messages.get("serverErr") || "", "error");
		});

		this.isChangeStorage$.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(persistent => {
			if (persistent)
				this.close();
		});
	}

	public ngAfterViewInit(): void {
		if (!this.messagesErrors)
			throw Error("No messagesErrors");
		this.messages = TemplateUtil.getMap(this.messagesErrors.nativeElement);
	}

	public initForm(): void {
		this.form = this.formBuilder.group({
			gln: [null],
			storageName: [null],
			storageCodeInErp: [null],
			postalCode: [null],
			country: [{ id: 17, name: "Беларусь" }],
			address: [null],
			addressNumHouse: [null],
			addressNumHousing: [null],
			addressNumOffice: [null],
			addressStreetType: [null],
			city: [null],
			id: [null],
			region: [null],
		});
	}

	public save(): void {
		if (!this.form)
			throw Error("No form");

		const controlsLargeMaxLength = ["storageName", "city", "address", "addressNumHouse", "addressNumHousing", "addressNumOffice"];
		const controlsSmallMaxLength = ["postalCode", "storageCodeInErp"];

		controlsLargeMaxLength.forEach(controlName => this.form && this.form.controls[controlName].setValidators(Validators.maxLength(255)));
		controlsSmallMaxLength.forEach(controlName => this.form && this.form.controls[controlName].setValidators(Validators.maxLength(35)));
		this.form.controls["gln"].setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13), ValidatorsUtil.checkSumGLN()]);
		this.form.controls["country"].setValidators(Validators.required);
		this.form.controls["postalCode"].setValidators([Validators.maxLength(35), Validators.required]);
		this.updateFormValueAndValidity();

		if (this.form.valid) {
			const storage: StorageCreate = {
				address: this.form.value.address,
				addressNumHouse: this.form.value.addressNumHouse,
				addressNumHousing: this.form.value.addressNumHousing,
				addressNumOffice: this.form.value.addressNumOffice,
				addressStreetTypeId: this.form.value.addressStreetType && this.form.value.addressStreetType.id,
				city: this.form.value.city,
				countryId: this.form.value.country && this.form.value.country.id,
				gln: this.form.value.gln,
				id: this.form.value.id,
				postalCode: this.form.value.postalCode,
				regionId: this.form.value.region && this.form.value.region.id,
				storageCodeInErp: this.form.value.storageCodeInErp,
				storageName: this.form.value.storageName,
			};
			this.store.dispatch(saveStorage(storage));
		}
	}

	public getFirstErrorKey(): string | null | undefined {
		const glnFormGroup = this.form && this.form.get("gln");
		if (glnFormGroup) {
			const fronErrorKey = glnFormGroup.errors && Object.keys(glnFormGroup.errors)[0];
			return fronErrorKey || (this.errorMessages && this.errorMessages.gln.length ? "back" : undefined);
		}
	}

	public getMessage(code: string): string | undefined {
		if (!this.messages)
			throw new Error("No messages errors!");

		return this.messages.get(code) || this.messages.get("unknown");
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public updateStreetsFilter(streetName?: string): void {
		this.customizationFilterService.updateFilter(this.streetsFilter, resetStreets, updateStreetsFilter, streetName);
	}

	public updateRegionsFilter(regionName?: string): void {
		this.customizationFilterService.updateFilter(this.regionsFilter, resetRegions, updateRegionsFilter, regionName);
	}

	public updateCountriesFilter(countryName?: string): void {
		this.customizationFilterService.updateFilter(this.countriesFilter, resetCountries, updateCountriesFilter, countryName);
	}

	public transformFn(value: any): [any, string] {
		return [value, `${value.name}`];
	}

	private updateFormValueAndValidity(): void {
		if (!this.form)
			throw Error("No form");

		const formControls = ["gln", "storageName", "storageCodeInErp", "postalCode", "country", "city", "address", "addressNumHouse", "addressNumHousing", "addressNumOffice"];
		formControls.forEach(controlName => this.form && this.form.controls[controlName].updateValueAndValidity());
		this.form.updateValueAndValidity();
	}
}
