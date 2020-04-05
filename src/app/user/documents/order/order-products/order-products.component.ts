import {
	Component,
	ChangeDetectionStrategy,
	Input,
	OnDestroy,
	ChangeDetectorRef, OnInit, ViewChild
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { OrderProductPopupComponent } from "../order-product-popup/order-product-popup.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OrderFormBuilderService } from "../order/order-form-builder.service";
import { Big } from "big.js";
import { MessageType } from "@helper/abstraction/documents";
import { OrderProductParams, OrderResponseParams } from "@helper/abstraction/order";
import { OverlayComponent } from "@shared/overlay/overlay.component";

@Component({
	selector: "app-order-products",
	templateUrl: "./order-products.component.html",
	styleUrls: ["../form.scss", "./order-products.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderProductsComponent implements OnDestroy, OnInit {
	public clickId?: number | null;
	@Input() public form?: FormGroup;
	@Input() public document?: OrderResponseParams;
	@Input() public responseProducts?: OrderProductParams[];
	@Input() public messageType?: Extract<MessageType, "ORDERS" | "ORDRSP">;

	public get products(): FormArray {
		if (!this.form)
			throw Error("No form");
		return this.form.get("products") as FormArray;
	}

	public isTableHide = false;
	@ViewChild("overlay", { static: false }) private overlayService?: OverlayComponent;
	private unsubscribe$$ = new Subject<void>();
	constructor(
		private readonly orderFormBuilderService: OrderFormBuilderService,
		private readonly changeDetectorRef: ChangeDetectorRef
	) { }

	public ngOnInit(): void {
		this.form && this.form.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: { autoSum: boolean }) => {
			if (value.autoSum)
				this.calculateTotal();
			this.changeDetectorRef.detectChanges();
		});
	}

	public addProduct(): void {
		if (!this.form)
			throw Error("No form");

		if (!this.overlayService)
			throw Error("No overlay component");

		const form = this.orderFormBuilderService.getOrderProductFrom();
		const component = this.overlayService.show(OrderProductPopupComponent, {
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
			if (this.overlayService) {
				this.overlayService.destroy();
				this.changeDetectorRef.detectChanges();
			}
		});
	}

	public editProduct(product: OrderProductParams, event: Event): void {
		event.stopPropagation();
		if (!this.form)
			throw Error("No form");

		if (!this.overlayService)
			throw Error("No overlay component");

		const messageType: Extract<MessageType, "ORDERS" | "ORDRSP"> = product.forbidDeleting ? "ORDRSP" : "ORDERS";

		const form = this.orderFormBuilderService.getOrderProductFrom(product, product.autoSum, messageType);

		const currentProduct: OrderProductParams | undefined = this.responseProducts && this.responseProducts.find(responseProduct => responseProduct.position === product.position);

		const component = this.overlayService.show(OrderProductPopupComponent, {
			inputs: {
				form,
				formArrays: this.form.get("products"),
				position: form.getRawValue().position,
				mode: "EDIT",
				messageType,
				currentProduct
			},
			centerPosition: true
		});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (this.overlayService) {
				this.overlayService.destroy();
				this.changeDetectorRef.detectChanges();
			}
		});
	}

	public delete(product: OrderProductParams, index: number, event: Event): void {
		event.stopPropagation();
		if (product.forbidDeleting) {
			this.products.at(index).patchValue({
				action: 7,
				quantityOrderedLu: 0,
				quantityAccepted: 0,
				amountWithoutVat: 0,
				vatRate: 0,
				mountVat: 0,
				amountVat: 0,
				amountWithVat: 0
			});
		} else
			this.products.removeAt(index);
	}

	public expandRow(index: number): void {
		this.clickId = this.clickId === index ? null : index;
	}

	public calculateTotal(): void {
		if (this.form) {
			this.form.patchValue({
				totalLine: this.products.getRawValue().reduce((acc, curr) => curr.action !== 7 ? acc += 1 : acc, 0),
				totalQuantityLu: this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["quantityOrderedLu"] || 0)), new Big(0).round(2).toString()),
				totalQuantity: this.messageType === "ORDRSP" ? this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["quantityAccepted"] || 0)), new Big(0).round(2).toString()) : this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["quantityOrdered"] || 0)), new Big(0).round(2).toString()),
				totalAmountWithoutVat: this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["amountWithoutVat"] || 0)), new Big(0).round(2).toString()),
				totalAmountVat: this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["amountVat"] || 0)), new Big(0).round(2).toString()),
				totalAmountWithVat: this.products.getRawValue().reduce((acc, curr) => new Big(acc).plus(new Big(curr["amountWithVat"] || 0)), new Big(0).round(2).toString()),
			}, { emitEvent: false });
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
