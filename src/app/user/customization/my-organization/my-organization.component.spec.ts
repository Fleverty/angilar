/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MyOrganizationComponent } from "./my-organization.component";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule, Store } from "@ngrx/store";
import { APP_BASE_HREF } from "@angular/common";
import { of } from "rxjs";

describe("MyOrganizationComponent", () => {
	let component: MyOrganizationComponent;
	let fixture: ComponentFixture<MyOrganizationComponent>;

	const storeMock = {
		persistent$: of(undefined),
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
				MyOrganizationComponent
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(MyOrganizationComponent);
		component = fixture.componentInstance;
		component.persistent$ = storeMock.persistent$;
		fixture.detectChanges();
	});

	it("Should create.", () => {
		expect(component).toBeTruthy();
	});
});
