/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderComponent } from "./order.component";
import { SharedModule } from "@shared/shared.module";
import { OrderCommonComponent } from "../order-common/order-common.component";
import { OrderBuyerComponent } from "../order-buyer/order-buyer.component";
import { OrderSupplierComponent } from "../order-supplier/order-supplier.component";
import { OrderSupplyPointComponent } from "../order-supply-point/order-supply-point.component";
import { OrderFinalRecipientComponent } from "../order-final-recipient/order-final-recipient.component";
import { OrderCommentComponent } from "../order-comment/order-comment.component";
import { ReactiveFormsModule } from "@angular/forms";
import { OrderFormBuilderService } from "./order-form-builder.service";
import { OrderProductsComponent } from "../order-products/order-products.component";

describe("OrderCreateComponent", () => {
	let component: OrderComponent;
	let fixture: ComponentFixture<OrderComponent>;

	const popupServiceStub = {
		open: (): void => { }
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule
			],
			providers: [
				{ provide: OrderFormBuilderService, useValue: popupServiceStub },
			],
			declarations: [
				OrderComponent,
				OrderCommonComponent,
				OrderBuyerComponent,
				OrderSupplierComponent,
				OrderSupplyPointComponent,
				OrderFinalRecipientComponent,
				OrderCommentComponent,
				OrderProductsComponent,
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
