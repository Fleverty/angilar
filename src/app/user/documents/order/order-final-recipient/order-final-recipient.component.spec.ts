/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderFinalRecipientComponent } from "./order-final-recipient.component";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("OrderFinalRecipientComponent", () => {
	let component: OrderFinalRecipientComponent;
	let fixture: ComponentFixture<OrderFinalRecipientComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule,
			],
			declarations: [OrderFinalRecipientComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderFinalRecipientComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
