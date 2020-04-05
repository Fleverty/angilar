/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderSupplyPointComponent } from "./order-supply-point.component";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("OrderSupplyPointComponent", () => {
	let component: OrderSupplyPointComponent;
	let fixture: ComponentFixture<OrderSupplyPointComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule,
			],
			declarations: [OrderSupplyPointComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderSupplyPointComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
