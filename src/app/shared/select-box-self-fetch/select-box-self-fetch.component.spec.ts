/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SelectBoxSelfFetchComponent } from "./select-box-self-fetch.component";

describe("SelectboxSelfFetchComponent", () => {
	let component: SelectBoxSelfFetchComponent<any>;
	let fixture: ComponentFixture<SelectBoxSelfFetchComponent<any>>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SelectBoxSelfFetchComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectBoxSelfFetchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
