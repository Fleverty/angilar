import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	ChangeDetectorRef,
	OnInit
} from "@angular/core";
import { ShipmentNotificationProduct } from "@helper/abstraction/shipment-notification";
import { TotalSums } from "@app/user/documents/shipment-notification/total-sums";
import { FormGroup, FormArray } from "@angular/forms";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { ShipmentNotificationFormBuilderService } from "../shipment-notification-form-builder.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ShipmentNotificationProductPopupComponent } from "../shipment-notification-product-popup/shipment-notification-product-popup.component";
import { Big } from "big.js";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-products-list",
	templateUrl: "./shipment-notification-products-list.component.html",
	styleUrls: ["./shipment-notification-products-list.component.scss"]
})
export class ShipmentNotificationProductsListComponent implements OnInit {
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
		private readonly shipmentNotificationFormBuilderService: ShipmentNotificationFormBuilderService,
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

		const form = this.shipmentNotificationFormBuilderService.getShipmentNotificationsProductForm();

		const component = this.overlayComponent.show(ShipmentNotificationProductPopupComponent, {
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

	public edit(product: ShipmentNotificationProduct, event: Event, index: number): void {
		event.stopPropagation();
		if (!this.overlayComponent)
			throw Error("No overlay component");
		if (!this.form)
			throw Error("No form");

		const form = this.shipmentNotificationFormBuilderService.getShipmentNotificationsProductForm(product);
		const component = this.overlayComponent.show(ShipmentNotificationProductPopupComponent, {
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
					quantityDespatch: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantityDespatch"] || 0))), new Big(0).round(2).toString()),
					amountWithoutVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithoutVat"] || 0))), new Big(0).round(2).toString()),
					amountExcise: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountExcise"] || 0))), new Big(0).round(2).toString()),
					amountVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountVat"] || 0))), new Big(0).round(2).toString()),
					amountWithVat: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["amountWithVat"] || 0))), new Big(0).round(2).toString()),
					quantityDespatchLu: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["quantityDespatchLu"] || 0))), new Big(0).round(2).toString()),
					grossWeight: this.products.getRawValue().reduce((acc, curr) => (new Big(acc).plus(new Big(curr["grossWeight"] || 0))), new Big(0).round(2).toString()),
				}
			}, { emitEvent: false });
		}
	}
}
