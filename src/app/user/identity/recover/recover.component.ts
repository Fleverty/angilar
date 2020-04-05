import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { ValidatorsUtil } from "@helper/validators-util";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslationService } from "@core/translation.service";

interface RecoverForm {
	password: string;
	passwordConfirmation: string;
	code: string;
	id: number;
}

@Component({
	selector: "app-recover",
	templateUrl: "./recover.component.html",
	styleUrls: ["./recover.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoverComponent implements OnDestroy {
	public form: FormGroup;
	private unsubscribe$$ = new Subject<void>();
	private validatorsUtil = ValidatorsUtil;

	constructor(
		private readonly translationService: TranslationService,
		public readonly formBuilder: FormBuilder,
		public readonly userBackendService: UserBackendService,
		private readonly overlayService: OverlayService,
		activatedRoute: ActivatedRoute,
		private router: Router
	) {
		const id = activatedRoute.snapshot.queryParamMap.get("id");
		const code = activatedRoute.snapshot.queryParamMap.get("code");
		if (id === null || code === null) {
			router.navigateByUrl("/user/login");
			throw Error("No params");
		}

		this.form = this.formBuilder.group({
			code: [code],
			id: [id],
			password: [null, [
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(255),
				this.validatorsUtil.noOneSpecialCharacters(),
				this.validatorsUtil.noOneUppercaseLatinCharacters(),
				this.validatorsUtil.noOneLowercaseLatinCharacters(),
				this.validatorsUtil.onlyLatinOrSpecialCharactersAllowed()
			]],
			passwordConfirmation: [null, Validators.required]
		}, {
			validators: [this.validatorsUtil.doNotMatch("password", "passwordConfirmation")]
		});
		this.form.valueChanges.pipe(
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.form.markAsTouched());
	}

	public async submit(value: RecoverForm): Promise<void> {
		try {
			await this.userBackendService.user.activate.post$({
				code: value.code,
				id: +value.id,
				newPassword: value.password,
				newPasswordReplay: value.passwordConfirmation
			}).pipe(
				takeUntil(this.unsubscribe$$),
				take(1),
			).toPromise();
		} catch (error) {
			this.overlayService.showNotification$(error.error.error, "error");
			return;
		}
		this.router.navigateByUrl("/user/login");
		this.overlayService.showNotification$(this.translationService.getTranslation("userActivationSuccess"), "success");
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
