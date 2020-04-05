/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderCommonComponent } from "./order-common.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { OrdersSelectorService } from "../order-selector.service";

describe("OrderCommonComponent", () => {
	let component: OrderCommonComponent;
	let fixture: ComponentFixture<OrderCommonComponent>;

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
				{ provide: OrdersSelectorService, useValue: popupServiceStub },
			],
			declarations: [OrderCommonComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderCommonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
