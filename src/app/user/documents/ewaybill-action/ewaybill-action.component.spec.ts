
import { APP_BASE_HREF } from "@angular/common";
import { async, TestBed } from "@angular/core/testing";
import { AppComponent } from "@app/app.component";
import { AppModule } from "@app/app.module";
import { SharedModule } from "@shared/shared.module";

import { EwaybillActionComponent } from "./ewaybill-action.component";

describe("EwaybillActionComponent", () => {
	let component: EwaybillActionComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule, AppModule],
			declarations: [EwaybillActionComponent],
			providers: [
				{ provide: APP_BASE_HREF, useValue: "/" }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		const appFixture = TestBed.createComponent(AppComponent);
		appFixture.detectChanges();
		const ewaybillActionFixture = TestBed.createComponent(EwaybillActionComponent);
		component = ewaybillActionFixture.componentInstance;
		ewaybillActionFixture.detectChanges();
	});

	it("should throw error about overlay component in", () => {
		expect(component).toBeTruthy();
	});
});
