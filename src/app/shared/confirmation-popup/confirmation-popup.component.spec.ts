/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmationPopupComponent } from "./confirmation-popup.component";
import { IconComponent } from "./../icon/icon.component";
import { SkinComponent } from "./../skin/skin.component";

describe("ConfirmationPopupComponent", () => {
	let component: ConfirmationPopupComponent;
	let fixture: ComponentFixture<ConfirmationPopupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ConfirmationPopupComponent, IconComponent, SkinComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmationPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
