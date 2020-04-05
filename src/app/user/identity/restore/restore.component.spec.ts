import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";

import { RestoreComponent } from "./restore.component";

describe("RestoreComponent", () => {
	// let component: RestoreComponent;
	let fixture: ComponentFixture<RestoreComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule],
			declarations: [RestoreComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RestoreComponent);
		// component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// it("should create", () => {
	// 	expect(component).toBeTruthy();
	// });
});
