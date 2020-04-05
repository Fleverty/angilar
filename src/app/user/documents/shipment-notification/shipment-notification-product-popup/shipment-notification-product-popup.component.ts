import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
	AfterViewInit
} from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormArray, FormGroup } from "@angular/forms";
import { UnitOfMeasure, UnitOfMeasuresParams } from "@helper/abstraction/unit-of-measures";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as ShipmentNotificationsActions from "../shipment-notification.actions";
import { ShipmentNotificationProduct } from "@helper/abstraction/shipment-notification";
import { ShipmentNotificationSelectorService } from "../shipment-notification-selector.service";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { Big } from "big.js";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { ShipmentNotificationsState } from "../shipment-notification.reducer";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { ValidatorsUtil } from "@helper/validators-util";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notifications-product-popup",
	templateUrl: "./shipment-notification-product-popup.component.html",
	styleUrls: ["./shipment-notification-product-popup.component.scss"]
})
export class ShipmentNotificationProductPopupComponent extends DefaultPopupComponent implements OnInit, AfterViewInit {
	@Input() public form?: FormGroup;
	@Input() public formArrays?: FormArray;
	@Input() public position?: number;
	@Input() public mode: "CREATE" | "EDIT" = "CREATE";
	public rounding = true;
	public unitOfMeasuresFilter: UnitOfMeasuresParams = {
		page: 0,
		size: 30,
		searchText: "",
	};
	public countriesFilter: CountriesParams = {
		page: 0,
		size: 30,
		searchText: "",
	};
	public unitOfMeasures$?: Observable<[UnitOfMeasure, string][]>;
	public countries$?: Observable<[Country, string][]>;
	@ViewChild("popupMessage", { static: true }) private popupMessage?: ElementRef<HTMLTemplateElement>;
	private messages: Map<string, string> = new Map<string, string>();
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly overlayService: OverlayService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly userFilterService: UserFilterService<ShipmentNotificationsState>,
		private readonly shipmentNotificationSelectorService: ShipmentNotificationSelectorService,
		private readonly userErrorsService: UserErrorsService
	) {
		super();

		this.unitOfMeasures$ = this.shipmentNotificationSelectorService.selectDictionariesFromStore$<UnitOfMeasure>(
			(uom: UnitOfMeasure): string => `${uom.name}`,
			(state: ShipmentNotificationsState): UnitOfMeasure[] | undefined => state.unitsOfMeasures
		);

		this.countries$ = this.shipmentNotificationSelectorService.selectDictionariesFromStore$<Country>(
			(country: Country): string => `${country.name}`,
			(state: ShipmentNotificationsState): Country[] | undefined => state.countries
		);
	}

	public ngOnInit(): void {
		if (!this.form) {
			throw Error("No form!");
		}

		this.updateUnitOfMeasuresFilter({ search: "" });
		this.updateCountriesFilter({ search: "" });

		if (this.position)
			this.form.patchValue({ position: this.position });


		this.form.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((value: ShipmentNotificationProduct): void => {
			if (this.rounding) {
				this.changeTotal(value);
			}
		});
	}

	public ngAfterViewInit(): void {
		if (!this.popupMessage)
			throw Error("no popupMessage");
		this.messages = TemplateUtil.getMap(this.popupMessage.nativeElement);
		this.changeDetectorRef.detectChanges();
	}

	public updateUnitOfMeasuresFilter(uomName?: { search: string }): void {
		this.userFilterService.updateFilter(this.unitOfMeasuresFilter, ShipmentNotificationsActions.resetUnitOfMeasures, ShipmentNotificationsActions.updateUnitOfMeasuresFilter, uomName && uomName.search);
	}

	public updateCountriesFilter(country?: { search: string }): void {
		this.userFilterService.updateFilter(this.countriesFilter, ShipmentNotificationsActions.resetCountries, ShipmentNotificationsActions.updateCountriesFilter, country && country.search);
	}

	public tranformFn(value: { id: string; name: string }): [any, string] {
		return [value, value.name];
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public clickRounding(flag: boolean, form: FormGroup): void {
		this.rounding = flag;
		this.changeTotal(form.getRawValue());
		this.changeDetectorRef.detectChanges();
	}

	public cancel(): void {
		this.close();
	}

	public save(form: FormGroup): void {
		if (!form || !this.formArrays)
			throw Error("NO FORM");

		const isTwoStars: boolean = form.value.gtin || form.value.codeByBuyer || form.value.codeBySupplier;
		if (!isTwoStars) {
			const m = this.messages.get("text");
			if (!m) throw Error("No message");
			this.overlayService && this.overlayService.showNotification$(m, "error");
			return;
		}

		if (form.invalid) {
			ValidatorsUtil.triggerValidation(form);
			this.userErrorsService.displayErrors(form);
			return;
		}

		this.formArrays && this.formArrays.push(form);
		this.close();
	}

	public edit(form: FormGroup): void {
		if (!form || !this.formArrays)
			throw Error("No full EwaybillProductsPopup inputs");
		if (!this.position || !Number.isFinite(this.position))
			throw Error("Don't have position number!");

		form.markAllAsTouched();

		const isTwoStars: boolean = form.value.gtin || form.value.codeByBuyer || form.value.codeBySupplier;
		if (!isTwoStars) {
			const m = this.messages.get("text");
			if (!m) throw Error("No message");
			this.overlayService && this.overlayService.showNotification$(m, "error");
			return;
		}


		if (form.invalid) {
			ValidatorsUtil.triggerValidation(form);
			this.userErrorsService.displayErrors(form);
			return;
		}

		this.formArrays.removeAt(this.position - 1);
		this.formArrays.insert(this.position - 1, form);
		this.close();
	}

	private changeTotal(data?: ShipmentNotificationProduct): void {
		if (!data) {
			data = this.form && this.form.value;
		} else if (this.rounding) {
			if (data.quantityDespatch && data.priceNet) {
				const amountWithoutVat: Big = new Big(data.quantityDespatch || 0).times(new Big(data.priceNet)).round(2);
				this.form && this.form.patchValue({ amountWithoutVat }, { emitEvent: false });
				if (data.vatRate) {
					const amountVat: Big = amountWithoutVat.times(new Big(data.vatRate).div(100)).round(2);
					const amountWithVat: Big = amountWithoutVat.plus(new Big(amountVat).round(2)).round(2);
					this.form && this.form.patchValue({
						amountWithVat,
						amountVat
					}, { emitEvent: false });
				}
			} else {
				this.form && this.form.patchValue({
					amountWithoutVat: 0,
					amountVat: 0,
					amountWithVat: 0
				}, { emitEvent: false });
			}
		}
	}
}
