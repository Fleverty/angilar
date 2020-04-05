import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createSelector, select, Store } from "@ngrx/store";
import { UserState } from "@app/user/user.reducer";
import { restoreUserPassword } from "@app/user/user.actions";
import { filter, takeUntil } from "rxjs/operators";
import { TemplateUtil } from "@helper/template-util";
import { Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { Router } from "@angular/router";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";

@Component({
	selector: "app-restore",
	templateUrl: "./restore.component.html",
	styleUrls: ["../login/login.component.scss", "../identity.component.scss", "./restore.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestoreComponent {
	public form: FormGroup;
	@ViewChild("errors", { read: ElementRef, static: false })
	public set errorsTemplate(element: ElementRef) {
		this.errorMessages = TemplateUtil.getMap(element.nativeElement);
	}

	public unsubscribe$$ = new Subject<void>();
	private errorMessages: Map<string, string> = new Map<string, string>();

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly store: Store<UserState>,
		private readonly userErrorsService: UserErrorsService,
		private readonly overlayService: OverlayService,
		private readonly router: Router
	) {
		this.form = this.formBuilder.group({
			email: [null, [Validators.required, Validators.maxLength(255), Validators.pattern(/[@]/)]]
		});

		const selectUserState = (appState: any): UserState => appState.user;
		const selectPasswordRestore = createSelector(selectUserState, (state: UserState): boolean | undefined => state.isPasswordRestore);

		this.store.pipe(
			select(selectPasswordRestore),
			filter(value => value !== undefined),
			takeUntil(this.unsubscribe$$)
		).subscribe((restorePasswordState: boolean | undefined) => {
			const message = restorePasswordState ? this.errorMessages.get("restorePasswordSuccess") : this.errorMessages.get("restorePasswordError");
			this.overlayService.showNotification$(message || "", restorePasswordState ? "success" : "error");

			if (restorePasswordState)
				this.router.navigate(["user", "login"]);
		});
	}

	public restore(): void {
		if (this.form.invalid) {
			this.userErrorsService.displayErrors(this.form);
			return;
		}

		const { email } = this.form.getRawValue();
		this.store.dispatch(restoreUserPassword({ email }));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
