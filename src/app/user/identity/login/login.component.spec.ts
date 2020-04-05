import { throwError } from "rxjs";

import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "@app/app.component";
import { AppModule } from "@app/app.module";
import { UserAuthService } from "@app/user/user-core/user-auth.service";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { ConfigurationService } from "@core/configuration.service";
import { StoreModule } from "@ngrx/store";
import { SharedModule } from "@shared/shared.module";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
	let component: LoginComponent;
	let appFixture: ComponentFixture<AppComponent>;
	let loginFixture: ComponentFixture<LoginComponent>;
	let authServiceSpy: any;
	let router: Router;
	beforeEach(() => {
		const authError = new HttpErrorResponse({ status: 401, error: "UNAUTHORIZED" });

		authServiceSpy = jasmine.createSpyObj("AuthService", ["loginAndRemember$", "login$"]);
		authServiceSpy.loginAndRemember$.and.returnValue(throwError(authError));
		authServiceSpy.login$.and.returnValue(throwError(authError));

		TestBed.configureTestingModule({
			imports: [
				AppModule,
				SharedModule,
				ReactiveFormsModule,
				HttpClientTestingModule,
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
				{ provide: UserAuthService, useValue: authServiceSpy },
				ConfigurationService,
				UserBackendService
			],
			declarations: [
				LoginComponent
			]
		}).compileComponents();
		appFixture = TestBed.createComponent(AppComponent);
		appFixture.detectChanges();
		loginFixture = TestBed.createComponent(LoginComponent);
		component = loginFixture.componentInstance;
		loginFixture.detectChanges();
		router = TestBed.get(Router);
		spyOn(router, "navigateByUrl");
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("expected an error UNAUTHORIZED", () => {
		authServiceSpy.loginAndRemember$("test", "test").subscribe(
			() => fail("expected an error, server cant is being available"),
			(error: HttpErrorResponse) => expect(error.status).toEqual(401)
		);
	});

	it("should call AuthServiceSpy.login$", () => {
		component.isRememberMe = false;
		loginFixture.detectChanges();
		component.login({ login: "test", password: "test" });
		expect(authServiceSpy.login$.calls.count()).toBe(1, "spy method was called once");
	});


	it("should call AuthServiceSpy.loginAndRemember$", () => {
		component.isRememberMe = true;
		loginFixture.detectChanges();
		component.login({ login: "test", password: "test" });
		expect(authServiceSpy.loginAndRemember$.calls.count()).toBe(1, "spy method was called once");
	});
});
