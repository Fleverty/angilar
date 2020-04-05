/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpContentComponent } from "./help-content.component";
import { APP_BASE_HREF } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule, Store } from "@ngrx/store";
import { of } from "rxjs";

describe("HelpContentComponent", () => {
	let component: HelpContentComponent;
	let fixture: ComponentFixture<HelpContentComponent>;

	const storeMock = {
		activeHelpContent$: of("activeHelpContent"),
		pipe: (e: any): any => {
			return e;
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				MarkdownModule.forRoot(),
				RouterTestingModule,
				StoreModule.forRoot([], {
					runtimeChecks: {
						strictStateImmutability: true,
						strictActionImmutability: true,
						strictStateSerializability: false,
						strictActionSerializability: false,
					}
				})
			],
			providers: [
				{ provide: Store, useValue: storeMock },
				{ provide: APP_BASE_HREF, useValue: "/" }
			],
			declarations: [
				HelpContentComponent
			],
		}).compileComponents();
		fixture = TestBed.createComponent(HelpContentComponent);
		component = fixture.componentInstance;
		component.activeHelpContent$ = storeMock.activeHelpContent$;
		fixture.whenStable();
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
