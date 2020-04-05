/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrganizationComponent } from "./organization.component";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule, Store } from "@ngrx/store";
import { APP_BASE_HREF } from "@angular/common";
import { of } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { OverlayService } from "@core/overlay.service";


describe("OrganizationComponent", () => {
	let component: OrganizationComponent;
	let fixture: ComponentFixture<OrganizationComponent>;

	const storeMock = {
		organization$: of(undefined),
		persistent$: of(undefined),
		pipe: (e: any): any => {
			return e;
		},
		dispatch(): void {
			//empty
		}
	};

	const popupServiceStub = {
		open: (): void => { }
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				RouterTestingModule,
				ReactiveFormsModule,
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
				{ provide: OverlayService, useValue: popupServiceStub },
				{ provide: APP_BASE_HREF, useValue: "/" }
			],
			declarations: [
				OrganizationComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(OrganizationComponent);
		component = fixture.componentInstance;
		component.organization$ = storeMock.organization$;
		component.persistent$ = storeMock.persistent$;
		fixture.detectChanges();
	});

	it("Should create.", () => {
		expect(component).toBeTruthy();
	});
});
