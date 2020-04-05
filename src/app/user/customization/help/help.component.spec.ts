/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { HelpComponent } from "./help.component";
import { APP_BASE_HREF } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule, Store } from "@ngrx/store";
import { of } from "rxjs";

describe("HelpComponent", () => {
	let component: HelpComponent;
	let fixture: ComponentFixture<HelpComponent>;

	const storeMock = {
		sectionList$: of([{
			text: "Помощь", id: "32", children: [
				{
					text: "Настройки", id: "10", children: [
						{ text: "Моя организация", id: "33" },
						{ text: "Мой профиль", id: "9" },
						{ text: "Уведомления", id: "8" }
					]
				}
			]
		}]),
		appState: "",
		pipe: (e: any): any => {
			return e;
		},
		dispatch(): void {
			//empty
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
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
				HelpComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(HelpComponent);
		component = fixture.componentInstance;
		component.sectionList$ = storeMock.sectionList$;
		fixture.whenStable();
		fixture.detectChanges();
	});

	it("Should create.", () => {
		expect(component).toBeTruthy();
	});

	// describe("Test clickPrevious(i), helpLinks = [{ text: 1, id: 1 }, { text: 1, id: 2 }].", () => {

	// 	it("Should navigate by url /user/customization/help/2.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.helpLinks = [{ text: "1", id: "1" }, { text: "1", id: "2" }];
	// 			component.clickPrevious(0);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/2");
	// 		})
	// 	);

	// 	it("Should navigate by url /user/customization/help/1.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.helpLinks = [{ text: "1", id: "1" }, { text: "1", id: "2" }];
	// 			component.clickPrevious(1);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/1");
	// 		})
	// 	);
	// });

	// describe("Test clickNext(i), helpLinks = [{ text: 1, id: 1 }, { text: 1, id: 2 }, { text: 1, id: 3 }].", () => {

	// 	it("Should navigate by url /user/customization/help/2.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.helpLinks = [{ text: "1", id: "1" }, { text: "1", id: "2" }, { text: "1", id: "3" }];
	// 			component.clickNext(0);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/2");
	// 		})
	// 	);

	// 	it("Should navigate by url /user/customization/help/3.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.helpLinks = [{ text: "1", id: "1" }, { text: "1", id: "2" }, { text: "1", id: "3" }];
	// 			component.clickNext(1);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/3");
	// 		})
	// 	);

	// 	it("Should navigate by url /user/customization/help/1.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.helpLinks = [{ text: "1", id: "1" }, { text: "1", id: "2" }, { text: "1", id: "3" }];
	// 			component.clickNext(2);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/1");
	// 		})
	// 	);

	// });

	// describe("Test goLink(1).", () => {
	// 	it("Should navigate by url /user/customization/help/1.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.goLink(1);
	// 			const navArgs = spy.calls.first().args[0];
	// 			expect(navArgs).toBe("/user/customization/help/1");
	// 		})
	// 	);
	// });

	// describe("Test searchIndexHelpLink(), helpLinks = [{ text: 1, id: 1 }, { text: 1, id: 23 }].", () => {
	// 	it("Should get index = 1, your helpID = 23.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.goLink(23);
	// 			const componentFake = { router: { url: spy.calls.first().args[0] } };
	// 			const index = component.searchIndexHelpLink.call(componentFake, [{ text: "1", id: "1" }, { text: "1", id: "23" }]);
	// 			expect(index).toBe(1);
	// 		})
	// 	);

	// 	it("Should get index = -1, your helpID = 3.",
	// 		inject([Router], (router: Router) => {
	// 			const spy = spyOn(router, "navigateByUrl");
	// 			component.goLink(3);
	// 			const componentFake = { router: { url: spy.calls.first().args[0] } };
	// 			const index = component.searchIndexHelpLink.call(componentFake, [{ text: "1", id: "1" }, { text: "1", id: "23" }]);
	// 			expect(index).toBe(-1);
	// 		})
	// 	);
	// });
});
