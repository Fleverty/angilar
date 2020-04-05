import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ValidatorFn } from "@angular/forms";
import { CustomizationState } from "../../customization.reducer";
import { Store, createSelector, select } from "@ngrx/store";
import { changePassword } from "../../customization.actions";
import { ValidatorsUtil } from "@helper/validators-util";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { Observable, Subject } from "rxjs";
import { TemplateUtil } from "@helper/template-util";
import { notNull } from "@helper/operators";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-profile-change-password",
	templateUrl: "./profile-change-password.component.html",
	styleUrls: ["./profile-change-password.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileChangePasswordComponent extends DefaultPopupComponent implements OnInit {
	public form?: FormGroup;
	public isPopupDisplay = false;
	public validatorsUtil = ValidatorsUtil;
	public passwordError$: Observable<Record<string, string[]> | undefined>;
	public isChangePassword$: Observable<boolean | undefined>;
	@ViewChild("messagesErrors", { static: true }) public messagesErrors?: ElementRef<HTMLTemplateElement>;
	public messages?: Map<string, string>;
	public errorMessages?: Record<string, string[]>;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private formBuilder: FormBuilder,
		private readonly store: Store<CustomizationState>,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super();
		const section = (appState: any): CustomizationState => appState.customization;
		const passwordError = createSelector(section, (state: CustomizationState): Record<string, string[]> | undefined => state.passwordErrors);
		this.passwordError$ = this.store.pipe(select(passwordError));

		const isChangePassword = createSelector(section, (state: CustomizationState): boolean | undefined => state.isChangePassword);
		this.isChangePassword$ = this.store.pipe(select(isChangePassword));
	}

	public ngOnInit(): void {
		this.initForm();

		this.passwordError$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(messages => {
			this.errorMessages = messages;
			this.changeDetectorRef.detectChanges();
		});

		this.isChangePassword$.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(persistent => {
			if (persistent)
				this.close();
		});
	}

	public ngAfterViewInit(): void {
		if (!this.messagesErrors)
			throw Error("No messagesErrors");
		this.messages = TemplateUtil.getMap(this.messagesErrors.nativeElement);
	}

	public initForm(): void {
		this.form = this.formBuilder.group({
			previousPassword: [null],
			newPassword: [null],
			newPasswordReplay: [null],
		});
	}

	public save(): void {
		if (!this.form)
			throw Error("No form");
		const validators: ValidatorFn[] = [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern(/^[a-zA-Z0-9]{8,32}$/), this.validatorsUtil.nonRepeatingCharacters(8)];
		this.form.controls["previousPassword"].setValidators(Validators.required);
		this.form.controls["newPassword"].setValidators(validators);
		this.form.controls["newPasswordReplay"].setValidators(validators);
		this.form.setValidators([this.validatorsUtil.doNotMatch("newPassword", "newPasswordReplay")]);
		this.updateFormValueAndValidity();

		if (this.form.valid) {
			this.store.dispatch(changePassword(this.form.value));
		}
	}

	public getMessage(code: string): string | undefined {
		if (!this.messages)
			throw new Error("No messages errors!");

		return this.messages.get(code);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private updateFormValueAndValidity(): void {
		if (!this.form)
			throw Error("No form");
		this.form.controls["previousPassword"].updateValueAndValidity();
		this.form.controls["newPassword"].updateValueAndValidity();
		this.form.controls["newPasswordReplay"].updateValueAndValidity();
		this.form.updateValueAndValidity();
	}
}
