/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderCreatePopupComponent } from "./order-create-popup.component";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";

describe("OrderCreatePopupComponent", () => {
	let component: OrderCreatePopupComponent;
	let fixture: ComponentFixture<OrderCreatePopupComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				RouterTestingModule,
				ReactiveFormsModule,
			],
			declarations: [OrderCreatePopupComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderCreatePopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
