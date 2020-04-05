import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ShipmentNotificationProduct } from "@helper/abstraction/shipment-notification";
import { FormArray, FormGroup } from "@angular/forms";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Big } from "big.js";
import { EinvoicepmtFormBuilderService } from "@app/user/documents/einvoicepmt/einvoicepmt-form-builder.service";
import { EinvoicepmtProductPopupComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-product-popup/einvoicepmt-product-popup.component";
import { EinvoicepmtProductDto, EinvoicepmtProductFormValue } from "@helper/abstraction/einvoicepmt";
import { ExtraField } from "@helper/abstraction/extra-fields";

interface TotalSums {
	quantity: string;
	amountWithoutVat: string;
	amountVat: string;
	amountWithVat: string;
	isAutoSum: boolean;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-products-list",
	templateUrl: "./einvoicepmt-products-list.component.html",
	styleUrls: ["./einvoicepmt-products-list.component.scss"]
})
export class EinvoicepmtProductsListComponent {
	public showContent = true;
	public clickId?: number | null;
	@Output() public clickProduct: EventEmitter<ShipmentNotificationProduct> = new EventEmitter<ShipmentNotificationProduct>();


	@Input() public form?: FormGroup;
	public get products(): FormArray {
		if (!this.form)
			throw Error("No form");
		return this.form.get("products") as FormArray;
	}

	public get totalSums(): TotalSums | null {
		if (!this.form)
			throw Error("No form");
		const ts = this.form.get("totalSums");
		return ts && ts.value as TotalSums;
	}

	@ViewChild("create", { static: false }) private overlayComponent?: OverlayComponent;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly einvoicepmtFormBuilderService: EinvoicepmtFormBuilderService,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
	}

	public ngOnInit(): void {
		this.form && this.form.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: { totalSums: TotalSums }) => {
			if (value.totalSums.isAutoSum)
				this.calculateTotal();
			this.changeDetectorRef.detectChanges();
		});
	}

	public clickProductHandler(product: ShipmentNotificationProduct): void {
		this.clickProduct.emit(product);
	}

	public addProduct(): void {
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");

		const form = this.einvoicepmtFormBuilderService.getEinvoicepmtProductForm();

		const component = this.overlayComponent.show(EinvoicepmtProductPopupComponent, {
			inputs: {
				form,
				formArrays: this.form.get("products"),
				position: this.products.length + 1,
				mode: "CREATE",
			},
			centerPosition: true
		});
		this.changeDetectorRef.detectChanges();
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (this.overlayComponent) {
				this.overlayComponent.destroy();
				this.changeDetectorRef.detectChanges();
			}
		});
	}

	public delete(index: number, event: Event): void {
		event.stopPropagation();
		this.products.removeAt(index);
	}

	public edit(product: EinvoicepmtProductFormValue, event: Event, index: number): void {
		event.stopPropagation();
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");

		// TODO: TransformService from EinvoicepmtProductFormValue to EinvoicepmtProductDto
		const form = this.einvoicepmtFormBuilderService.getEinvoicepmtProductForm(product as unknown as EinvoicepmtProductDto);
		const component = this.overlayComponent.show(EinvoicepmtProductPopupComponent, {
			inputs: {
				form,
				formArrays: this.form.get("products"),
				position: index + 1,
				mode: "EDIT",
			},
			centerPosition: true
		});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			this.overlayComponent && this.overlayComponent.destroy();
			// this.changeDetectorRef.detectChanges();
		});
	}

	public expandRow(index: number): void {
		this.clickId = this.clickId === index ? null : index;
	}

	public calculateTotal(): void {
		if (this.form) {
			this.form.patchValue({
				totalSums: {
					quantity: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantityDespatch"] || 0))), new Big(0).round(2).toString()),
					amountWithoutVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithoutVat"] || 0))), new Big(0).round(2).toString()),
					amountVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountVat"] || 0))), new Big(0).round(2).toString()),
					amountWithVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithVat"] || 0))), new Big(0).round(2).toString()),
				}
			}, { emitEvent: false });
		}
	}

	public getFormatedExtraFieldsList(extraFields: ExtraField[]): string {
		return extraFields.filter((e: any) => Object.keys(e).every((key: string) => e[key])).map((e: ExtraField) => `${e.fieldName || ""}: ${e.fieldValue || ""}`).join("; ");
	}

	public isAllIsNotNull(array: any[]): boolean {
		return !array.every(element => Object.keys(element).every(key => !element[key]));
	}
}

