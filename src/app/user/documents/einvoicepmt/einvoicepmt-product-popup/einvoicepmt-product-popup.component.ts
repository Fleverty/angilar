import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormArray, FormGroup } from "@angular/forms";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { Observable, Subject } from "rxjs";
import { UnitOfMeasureDto, UnitOfMeasuresParams } from "@helper/abstraction/unit-of-measures";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { takeUntil } from "rxjs/operators";
import { Big } from "big.js";
import { ValidatorsUtil } from "@helper/validators-util";
import { OverlayService } from "@core/overlay.service";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { TemplateUtil } from "@helper/template-util";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-product-popup",
	templateUrl: "./einvoicepmt-product-popup.component.html",
	styleUrls: ["./einvoicepmt-product-popup.component.scss"]
})
export class EinvoicepmtProductPopupComponent extends DefaultPopupComponent {
	@Input() public form?: FormGroup;
	@Input() public formArrays?: FormArray;
	@Input() public position?: number;
	@Input() public mode: "CREATE" | "EDIT" = "CREATE";
	public rounding = true;

	public unitsOfMeasureSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<UnitOfMeasureDto> => {
			const params: UnitOfMeasuresParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.uom.list.get$(params, "EINVOICEPMT");
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.name]),
	};

	@ViewChild("popupMessage", { static: true }) private set popupMessage(value: ElementRef<HTMLTemplateElement>) {
		this.messages = TemplateUtil.getMap(value.nativeElement);
	}
	private messages: Map<string, string> = new Map<string, string>();
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly userBackendService: UserBackendService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly overlayService: OverlayService,
		private readonly userErrorsService: UserErrorsService
	) {
		super();
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.form) {
			if (typeof this.position === "number" && this.form)
				this.form.patchValue({ position: this.position });

			this.form && this.form.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe((value: any): void => {
				if (this.rounding) {
					this.changeTotal(value);
				}
			});
		}
	}

	public clickRounding(flag: boolean, form: FormGroup): void {
		this.rounding = flag;
		this.changeTotal(form.getRawValue());
		this.changeDetectorRef.detectChanges();
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
			throw Error("No full EinvoicepmtProductsPopup inputs");
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

	public cancel(): void {
		this.close();
	}

	private changeTotal(data?: any): void {
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
