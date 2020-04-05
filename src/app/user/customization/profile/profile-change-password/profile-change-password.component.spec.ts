/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProfileChangePasswordComponent } from "./profile-change-password.component";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule, Store } from "@ngrx/store";
import { provideMockActions } from "@ngrx/effects/testing";
import { ReplaySubject, of } from "rxjs";

describe("HelpComponent", () => {
	let component: ProfileChangePasswordComponent;
	let fixture: ComponentFixture<ProfileChangePasswordComponent>;
	let actions: ReplaySubject<any>;
	const storeMock = {
		passwordError$: of(undefined),
		isChangePassword$: of(undefined),
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
				FormsModule,
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
				provideMockActions(() => actions)
			],
			declarations: [
				ProfileChangePasswordComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(ProfileChangePasswordComponent);
		component = fixture.componentInstance;
		component.passwordError$ = storeMock.passwordError$;
		component.isChangePassword$ = storeMock.isChangePassword$;
		fixture.detectChanges();
	});

	it("Should create.", () => {
		expect(component).toBeTruthy();
	});

	it("Test getMessage()", () => {
		component.messages = new Map();
		component.messages.set("1", "first");
		const message = component.getMessage("1");
		expect(message).toBeTruthy("first");
	});
});
