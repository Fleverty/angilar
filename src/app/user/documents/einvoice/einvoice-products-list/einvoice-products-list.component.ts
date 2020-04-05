import {
	ChangeDetectionStrategy, Component, Input, ViewChild, ChangeDetectorRef
} from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";
import { Subject } from "rxjs";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { takeUntil } from "rxjs/operators";
import { FormGroup, FormArray } from "@angular/forms";
import { EinvoiceFormBuilderService } from "../services/einvoice-form-builder.service";
import { EinvoiceProductPopupComponent } from "../einvoice-product-popup/einvoice-product-popup.component";
import { TotalSums } from "../einvoice";
import { Big } from "big.js";

export type TotalValue = "amount" | "priceBr" | "cost" | "exciseAmount" | "rate" | "sumVAT" | "costWithVAT" | "numberPackages" | "massCargo";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-products-list",
	styleUrls: ["./einvoice-products-list.component.scss"],
	templateUrl: "./einvoice-products-list.component.html"
})
export class EinvoiceProductsListComponent {
	public showContent = true;
	public clickId: number | null = null;
	@Input() public form?: FormGroup;
	@Input() public messageType?: DraftType;
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
		private readonly einvoiceFormBuilderService: EinvoiceFormBuilderService,
		private readonly changeDetectorRef: ChangeDetectorRef
	) { }

	public ngOnInit(): void {
		this.form && this.form.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: { totalSums: TotalSums }) => {
			if (value.totalSums.isAutoSum)
				this.calculateTotal();
			this.changeDetectorRef.detectChanges();
		});
	}

	public expandRow(index: number): void {
		this.clickId = this.clickId === index ? null : index;
	}

	public addProduct(): void {
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");
		const form = this.einvoiceFormBuilderService.getProductForm();

		const component = this.overlayComponent.show(EinvoiceProductPopupComponent, {
			inputs: {
				form,
				formArrays: this.form.get("products"),
				position: this.products.length + 1,
				mode: "CREATE",
				messageType: this.messageType
			},
			centerPosition: true
		});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (this.overlayComponent) {
				this.overlayComponent.destroy();
				this.overlayComponent.changeDetectorRef.detectChanges();
			}
			this.changeDetectorRef.detectChanges();
		});
	}

	public delete(index: number, event: Event): void {
		event.stopPropagation();
		this.products.removeAt(index);
		if (this.products.length > 0)
			this.products.controls.forEach((product, index) => product.patchValue({ position: index + 1 }));
	}

	public edit(product: any, event: Event, index: number): void {
		event.stopPropagation();
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");

		const form = this.einvoiceFormBuilderService.getProductForm(product);
		const component = this.overlayComponent.show(EinvoiceProductPopupComponent, {
			inputs: {
				form,
				formArrays: this.form.get("products"),
				position: index + 1,
				mode: "EDIT",
				messageType: this.messageType
			},
			centerPosition: true
		});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			this.overlayComponent && this.overlayComponent.destroy();
			this.changeDetectorRef.detectChanges();
		});
	}

	public calculateTotal(): void {
		if (this.form) {
			this.form.patchValue({
				totalSums: {
					quantity: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantity"] || 0))), new Big(0).round(2).toString()),
					amountWithoutVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithoutVat"] || 0))), new Big(0).round(2).toString()),
					amountExcise: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountExcise"] || 0))), new Big(0).round(2).toString()),
					amountVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountVat"] || 0))), new Big(0).round(2).toString()),
					amountWithVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithVat"] || 0))), new Big(0).round(2).toString()),
				}
			}, { emitEvent: false });
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
