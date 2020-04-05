import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { HttpErrorResponse } from "@angular/common/http";
import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, AfterViewInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserAuthService } from "@app/user/user-core/user-auth.service";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements AfterViewInit {
	public form: FormGroup;
	public isRememberMe = false;
	public isShowRememberMe$: Observable<boolean>;
	@ViewChild("errors", { static: true })
	public errors?: ElementRef<HTMLElement>;

	private errorMessages = new Map<string, string>();
	private isFirstSending = true;

	constructor(
		private readonly authService: UserAuthService,
		private readonly formBuilder: FormBuilder,
		private readonly overlayService: OverlayService,
		public readonly router: Router,
		public readonly changeDetectorRef: ChangeDetectorRef
	) {
		this.isShowRememberMe$ = this.authService.isShowRememberLoginButton();
		this.form = this.formBuilder.group({
			login: [null],
			password: [null]
		});
	}

	public ngAfterViewInit(): void {
		if (!this.errors)
			throw Error("No errors");
		this.errorMessages = TemplateUtil.getMap(this.errors.nativeElement);
	}

	public async login({ login, password }: { login: string; password: string }): Promise<void> {
		if (!login || !password) {
			this.form.controls["login"].setValidators([Validators.required]);
			this.form.controls["password"].setValidators([Validators.required]);
			return this.updateFormValueAndValidity();
		}

		this.isFirstSending = false;
		this.cleanError();
		const login$ = this.isRememberMe ?
			this.authService.loginAndRemember$(login, password) :
			this.authService.login$(login, password);

		await login$.pipe(
			catchError((error: HttpErrorResponse) => {
				const errorClass = +error.status.toString()[0];
				let message = "";
				if (errorClass === 5) {
					if (error.status === 504)
						message = this.errorMessages.get("504") || error.error.message;
					else
						message = `${this.errorMessages.get("500") || ""}  ${error.error.message}`;
				} else if (errorClass === 4) {
					if (error.status === 401) {
						this.setFormErrors("badCredentials");
						message = this.errorMessages.get("401") || error.error.message;
					}

					if (error.status === 400 && (error.error.errorCode === "EX4001" || error.error.errorCode === "EX4002")) {
						this.setFormErrors("badCredentials");
						message = error.error.error || this.errorMessages.get("400") || error.error.message;
					}

					if (error.status === 404) {
						message = this.errorMessages.get("404") || error.error.message;
						this.setFormErrors("notFound");
					}
				}

				this.overlayService.showNotification$(message, "error");
				return throwError(error);
			})
		).toPromise();

		this.goMainPage();
	}

	public cleanError(): void {
		this.form.setErrors(null);
		this.overlayService.clear();
	}

	public onFormValueChange(): void {
		if (!this.isFirstSending)
			this.cleanError();
	}

	private setFormErrors(...keys: string[]): void {
		keys.forEach(key => {
			const err: { [key: string]: boolean } = {};
			err[key] = true;
			this.form.setErrors(err);
		});
		this.form.updateValueAndValidity();
	}

	private goMainPage(): void {
		this.router.navigateByUrl("/user/documents");
	}

	private updateFormValueAndValidity(): void {
		this.form.controls["login"].updateValueAndValidity();
		this.form.controls["password"].updateValueAndValidity();
		this.form.updateValueAndValidity();
	}
}
