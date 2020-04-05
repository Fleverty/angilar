/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderActionComponent } from "./order-action.component";
import { SharedModule } from "@shared/shared.module";
import { OverlayService } from "@core/overlay.service";
import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";

describe("OrderActionComponent", () => {
	let component: OrderActionComponent;
	let fixture: ComponentFixture<OrderActionComponent>;

	const popupServiceStub = {
		open: (): void => { }
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: APP_BASE_HREF, useValue: "/" },
				{ provide: OverlayService, useValue: popupServiceStub },
			],
			declarations: [OrderActionComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderActionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
