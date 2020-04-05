/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderBuyerComponent } from "./order-buyer.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";

describe("OrderBuyerComponent", () => {
	let component: OrderBuyerComponent;
	let fixture: ComponentFixture<OrderBuyerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule
			],
			declarations: [OrderBuyerComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderBuyerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
