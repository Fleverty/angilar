import {
	ChangeDetectionStrategy, Component, Input, ViewChild, ChangeDetectorRef, Inject, LOCALE_ID
} from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";
import { Subject } from "rxjs";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { takeUntil } from "rxjs/operators";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { EwaybillFormBuilderService } from "../ewaybill/ewaybill-form-builder.service";
import { EwaybillProductPopupComponent } from "../ewaybill-product-popup/ewaybill-product-popup.component";
import { TotalSums } from "../ewaybill";
import { Big } from "big.js";
import { ExtraField } from "@helper/abstraction/extra-fields";
import { ProductDocumentInformation, EwaybillProduct } from "@helper/abstraction/ewaybill";
import { DatePipe } from "@angular/common";
import { TranslationService } from "@core/translation.service";

export type TotalValue = "amount" | "priceBr" | "cost" | "exciseAmount" | "rate" | "sumVAT" | "costWithVAT" | "numberPackages" | "massCargo";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-products-list",
	styleUrls: ["./ewaybill-products-list.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-products-list.component.html"
})
export class EwaybillProductsListComponent {
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
		private readonly ewaybillFormBuilderService: EwaybillFormBuilderService,
		private readonly translationService: TranslationService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(LOCALE_ID) public locale: string
	) { }

	public ngOnInit(): void {
		if (this.form && !this.form.get("totalSums.grossWeight"))
			(this.form.controls.totalSums as FormGroup).addControl("grossWeight", new FormControl(null, Validators.required));
		this.form && this.form.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: { totalSums: TotalSums }) => {
			if (value.totalSums.isAutoSum) this.calculateTotal();
			this.changeDetectorRef.detectChanges();
		});
		if (this.form && this.form.value.products) {
			const products = this.form.get("products") as FormArray;
			products.controls.forEach(ctrl => {
				const data = ctrl.value;
				const amountWithoutVat: Big = new Big(data.priceNet || 0).times(new Big(data.quantityDespatch)).round(2);
				const amountVat: Big = data.vatRate ? amountWithoutVat.times(data.vatRate).div(100).round(2) : new Big(0);
				const amountWithVat: Big = amountWithoutVat.plus(amountVat);
				ctrl.patchValue({ amountWithoutVat, amountVat, amountWithVat }, { emitEvent: false });
			});
		}
		if (this.form && this.form.value.totalSums.isAutoSum) {
			this.calculateTotal();
			this.changeDetectorRef.detectChanges();
		}
	}

	public expandRow(index: number): void {
		this.clickId = this.clickId === index ? null : index;
	}

	public addProduct(): void {
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");
		const form = this.ewaybillFormBuilderService.getProductForm(this.messageType);

		const component = this.overlayComponent.show(EwaybillProductPopupComponent, {
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

	public edit(product: EwaybillProduct, event: Event, index: number): void {
		event.stopPropagation();
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");

		const form = this.ewaybillFormBuilderService.getProductForm(this.messageType, product);
		const component = this.overlayComponent.show(EwaybillProductPopupComponent, {
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
					quantityDespatch: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantityDespatch"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					amountWithoutVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithoutVat"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					amountExcise: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountExcise"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					amountVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountVat"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					amountWithVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithVat"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					quantityDespatchLu: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantityDespatchLu"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
					grossWeight: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["grossWeight"] || "0"))).toFixed(2), new Big(0).round(2).toFixed(2)),
				}
			}, { emitEvent: false });
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public getFormatedExtraFieldsList(extraFields: ExtraField[]): string {
		return extraFields.map((e: ExtraField) => `${e.fieldName}: ${e.fieldValue}`).join("; ");
	}

	public getFormatedCertsList(certList: ProductDocumentInformation[]): string {
		const datePipe = new DatePipe(this.locale);
		return certList.map((c: ProductDocumentInformation) => {
			const arr = [c.certType && c.certType.nameShort, c.certNumber];
			if (c.dateFrom) arr.push(`${this.translationService.getTranslation("from")} ${datePipe.transform(c.dateFrom, "dd.MM.yyy")}`);
			if (c.dateTo) arr.push(`${this.translationService.getTranslation("to")} ${datePipe.transform(c.dateTo, "dd.MM.yyy")}`);
			if (c.certPartyIssuingName) arr.push(`${this.translationService.getTranslation("issued")} ${c.certPartyIssuingName}`);
			return arr.join(" ");
		}).join("; ");
	}

	public isAllIsNotNull(array: any[]): boolean {
		return !array.every(element => Object.keys(element).every(key => !element[key]));
	}
}
