/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderCommentComponent } from "./order-comment.component";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("OrderCommentComponent", () => {
	let component: OrderCommentComponent;
	let fixture: ComponentFixture<OrderCommentComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule,
			],
			declarations: [OrderCommentComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(OrderCommentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
