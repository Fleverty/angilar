/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderSupplierComponent } from "./order-supplier.component";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("OrderSupplierComponent", () => {
	let component: OrderSupplierComponent;
	let fixture: ComponentFixture<OrderSupplierComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule,
			],
			declarations: [OrderSupplierComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderSupplierComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
