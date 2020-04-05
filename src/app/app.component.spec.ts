
import { APP_BASE_HREF } from "@angular/common";
import { async, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

describe("AppComponent", () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			providers: [
				{ provide: APP_BASE_HREF, useValue: "/" }
			],
		}).compileComponents();
	}));

	it("should render app-header tag", () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeDefined();
	});
});
