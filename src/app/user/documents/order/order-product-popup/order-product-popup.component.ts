import {
	Component,
	ChangeDetectionStrategy,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild, ElementRef, OnInit, ChangeDetectorRef
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { takeUntil } from "rxjs/operators";
import { TemplateUtil } from "@helper/template-util";
import { Big } from "big.js";
import { UnitOfMeasure, UnitOfMeasuresParams } from "@helper/abstraction/unit-of-measures";

import * as OrderActions from "../order.actions";
import { MessageType } from "@helper/abstraction/documents";
import { OrdersSelectorService } from "../order-selector.service";
import { Observable, Subject, timer } from "rxjs";
import { OrderProductParams } from "@helper/abstraction/order";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { OverlayService } from "@core/overlay.service";
import { OrdersState } from "../orders.reducer";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { ValidatorsUtil } from "@helper/validators-util";

@Component({
	selector: "app-order-product-popup",
	templateUrl: "./order-product-popup.component.html",
	styleUrls: ["./order-product-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderProductPopupComponent extends DefaultPopupComponent implements OnChanges, OnInit {
	@Input() public form?: FormGroup;
	@Input() public formArrays?: FormArray;
	@Input() public position?: number;
	@Input() public mode: "EDIT" | "CREATE" = "CREATE";
	@Input() public messageType?: Extract<MessageType, "ORDERS" | "ORDRSP">;
	@Input() public currentProduct?: OrderProductParams;
	public rounding = true;
	public unitOfMeasures$?: Observable<[UnitOfMeasure, string][]>;
	public unitOfMeasuresFilter: UnitOfMeasuresParams = {
		page: 1,
		size: 30,
		searchText: "",
	};
	@ViewChild("texts", { static: true }) private set textsTemplate(value: ElementRef) {
		this.texts = TemplateUtil.getMap(value.nativeElement);
	}
	private texts?: Map<string, string>;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly overlayService: OverlayService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly userFilterService: UserFilterService<OrdersState>,
		private readonly ordersSelectorService: OrdersSelectorService,
		private readonly userErrorsService: UserErrorsService
	) {
		super();
		this.unitOfMeasures$ = this.ordersSelectorService.selectDictionariesFromStore$<UnitOfMeasure>(
			uom => uom.name,
			state => state.unitsOfMeasures
		);

		this.updateUnitOfMeasuresFilter({ search: "" });
	}

	public ngOnChanges(sc: SimpleChanges): void {
		if (sc.position && this.position && this.form) {
			const control = this.form.get("position");
			if (control) {
				control.setValue(this.position);
				this.changeDetectorRef.detectChanges();
			}
		}
	}

	public ngOnInit(): void {
		this.rounding = this.form && this.form.getRawValue().autoSum;

		this.form && this.form.valueChanges.subscribe(() => {
			if (this.rounding)
				this.changeTotal();
		});
	}

	public create(): void {
		if (!this.form || !this.formArrays)
			throw Error("No full OrderProductPopupComponent inputs");

		const { gtin, codeByBuyer, codeBySupplier } = this.form.getRawValue();
		if (!gtin && !codeByBuyer && !codeBySupplier) {
			this.overlayService && this.overlayService.showNotification$(this.texts && this.texts.get("popupMessage") || "", "error");
			timer(2500).pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService && this.overlayService.clear());
			return;
		}

		if (this.mode === "CREATE" && this.messageType === "ORDRSP" && this.form.value.quantityAccepted)
			this.form.patchValue({ quantityOrdered: 0 }, { emitEvent: false });

		if (this.form.invalid) {
			ValidatorsUtil.triggerValidation(this.form);
			this.userErrorsService.displayErrors(this.form);
			return;
		}
		this.formArrays.push(this.form);
		this.close();
	}

	public edit(): void {
		if (!this.form || !this.formArrays || !this.position || !Number.isFinite(+this.position))
			throw Error("No full OrderProductPopupComponent inputs");

		if (this.form.invalid) {
			ValidatorsUtil.triggerValidation(this.form);
			this.userErrorsService.displayErrors(this.form);
			return;
		}

		if (this.form.getRawValue().forbidDeleting && this.currentProduct) {
			this.form.patchValue({
				action: this.checkValueNotChanged(this.form) ? 5 : 3
			});
		}

		this.formArrays.removeAt(this.position - 1);
		this.formArrays.insert(this.position - 1, this.form);
		this.close();
	}

	public checkValueNotChanged(form: FormGroup): boolean {
		const value: Required<OrderProductParams> = form.getRawValue();

		if (!this.currentProduct) {
			return false;
		}
		if (
			+value.gtin === +this.currentProduct.gtin &&
			value.codeByBuyer === this.currentProduct.codeByBuyer &&
			value.codeBySupplier === this.currentProduct.codeBySupplier &&
			value.fullName === this.currentProduct.fullName &&
			value.uom.id === this.currentProduct.uom.id &&
			value.quantityAccepted === this.currentProduct.quantityOrdered &&
			value.priceNet === this.currentProduct.priceNet &&
			value.vatRate === this.currentProduct.vatRate &&
			value.quantityOrderedLu == this.currentProduct.quantityOrderedLu &&
			value.quantityInPack == this.currentProduct.quantityInPack
		) {
			return true;
		}
		return false;
	}

	public updateUnitOfMeasuresFilter(uomName?: { search: string }): void {
		this.userFilterService.updateFilter(this.unitOfMeasuresFilter, OrderActions.resetUnitOfMeasures, OrderActions.updateUnitOfMeasuresFilter, uomName && uomName.search);
	}

	public clickRounding(): void {
		this.rounding = !this.rounding;
		this.changeTotal();
		this.changeDetectorRef.detectChanges();
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}


	public transformFn(value: UnitOfMeasure): [any, string] {
		return [value, value.name];
	}

	private changeTotal(): void {
		const data = this.form && this.form.getRawValue();
		if (this.rounding) {
			if ((data.quantityOrdered || data.quantityAccepted) && data.priceNet) {
				let amountWithoutVat: Big;
				if (this.messageType === "ORDRSP" && data.quantityAccepted)
					amountWithoutVat = new Big(data.quantityAccepted).times(new Big(data.priceNet)).round(2);
				else
					amountWithoutVat = new Big(data.quantityOrdered).times(new Big(data.priceNet)).round(2);

				this.form && this.form.patchValue({ amountWithoutVat }, { emitEvent: false });
				if (data.vatRate) {
					const amountVat: Big = amountWithoutVat.times(new Big(data.vatRate).div(100)).round(2);
					const amountWithVat: Big = amountWithoutVat.plus(new Big(amountVat).round(2)).round(2);
					this.form && this.form.patchValue({
						amountWithVat: amountWithVat,
						amountVat: amountVat
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
