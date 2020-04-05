import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { OverlayService } from "@core/overlay.service";
import { ProfileChangePasswordComponent } from "./profile-change-password/profile-change-password.component";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { Subscription, Observable, Subject } from "rxjs";
import { Store, createSelector, select } from "@ngrx/store";
import { CustomizationState } from "../customization.reducer";
import { openPopupChangePassword, saveProfile, changeProfile, cancelSaveProfile, recordProfile, updateStoragesListFilter, resetStoragesList } from "../customization.actions";
import { UserProfile } from "@helper/abstraction/user";
import { notNull, scanData } from "@helper/operators";
import { takeUntil, map, take, filter, withLatestFrom, skip } from "rxjs/operators";
import { TemplateUtil } from "@helper/template-util";
import { UserState } from "@app/user/user.reducer";
import { Storage } from "@helper/abstraction/storages";
import { HttpErrorResponse } from "@angular/common/http";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";

interface StagesFilter {
	page: number;
	size: number;
	search?: string;
}
@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnDestroy {
	public form: FormGroup;
	public userProfile$: Observable<UserProfile | undefined>;
	public userProfileUserState$: Observable<UserProfile | undefined>;
	public persistent$: Observable<boolean | undefined>;
	public saveError$: Observable<Error | undefined>;
	@ViewChild("popupMessage", { static: true }) public popupMessage?: ElementRef<HTMLTemplateElement>;
	public storagesLists$: Observable<[Storage, string][]>;
	public messages: Map<string, string> = new Map<string, string>();
	private subscription?: Subscription;
	private unsubscribe$$ = new Subject<void>();
	private storagesListLoaded = false;
	private storagesListFilter: StagesFilter = {
		page: 1,
		size: 40
	};

	constructor(
		private readonly store: Store<CustomizationState>,
		private activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly overlayService: OverlayService,
		private readonly formBuilder: FormBuilder,
		private readonly userErrorsService: UserErrorsService
	) {
		const user = (appState: any): UserState => appState.user;
		const userProfileUserState = createSelector(user, (state: UserState): UserProfile | undefined => state.userProfile);
		this.userProfileUserState$ = this.store.pipe(select(userProfileUserState));

		const section = (appState: any): CustomizationState => appState.customization;
		const userProfile = createSelector(section, (state: CustomizationState): UserProfile | undefined => state.userProfile);
		this.userProfile$ = this.store.pipe(select(userProfile));

		const isChangeUserProfile = createSelector(section, (state: CustomizationState): boolean | undefined => state.isChangeUserProfile);
		this.persistent$ = this.store.pipe(select(isChangeUserProfile));

		const saveError = createSelector(section, (state: CustomizationState): Error | undefined => state.saveError);
		this.saveError$ = this.store.pipe(select(saveError));

		const storagesLists = createSelector(section, (state: CustomizationState): Storage[] | undefined => state.storagesList);
		this.storagesLists$ = this.store.pipe(
			select(storagesLists),
			scanData<Storage>(),
			map((storages): [Storage, string][] => storages ? storages.map((p): [Storage, string] => ([p, [p.addressFull, p.storageName].filter(e => !!e).join(", ")])) : []),
		);

		const baseUrl = "/user/customization/profile";

		this.router.events.pipe(
			filter(event => event instanceof NavigationStart),
			withLatestFrom(this.persistent$),
			filter(e => (e[1] && (e[0] as NavigationStart).url !== baseUrl) === true),
			takeUntil(this.unsubscribe$$)
		).subscribe((e) => {
			const newUrl = (e[0] as NavigationStart).url;
			this.router.navigateByUrl(baseUrl); // you stop in 'baseUrl'
			if (!this.messages)
				throw Error("No template!");
			const [ask, agree] = [this.messages.get("ask"), this.messages.get("agreeButtonText")];

			if (ask && agree)
				this.overlayService.showConfirmation$(ask, agree).then(isAgree => {
					if (isAgree) {
						this.saveProfile();
						this.persistent$.pipe(
							filter(persistent => persistent === false),
							takeUntil(this.unsubscribe$$)
						).subscribe(() => this.router.navigateByUrl(newUrl));
					} else {
						this.store.dispatch(cancelSaveProfile());
						this.router.navigateByUrl(newUrl);
					}
				});
			else
				throw Error("No ask or agree");
		});
		this.form = this.getForm();

		this.updateStoragesListsFilter(1, "", 40);
		this.userProfileUserState$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(userProfile => {
			this.store.dispatch(recordProfile(userProfile));
			this.form.reset(userProfile, { emitEvent: false });
			this.form.updateValueAndValidity({ emitEvent: false });
		});
	}

	public ngOnInit(): void {
		this.form.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(() => {
			this.store.dispatch(changeProfile(this.form.getRawValue()));
		});
	}

	public ngAfterViewInit(): void {
		if (!this.popupMessage)
			throw Error("No popupMessage");
		this.messages = TemplateUtil.getMap(this.popupMessage.nativeElement);
	}

	public saveProfile(): void {
		ValidatorsUtil.triggerValidation(this.form);
		if (this.form.invalid) {
			this.userErrorsService.displayErrors(this.form);
			return;
		}

		this.store.dispatch(saveProfile());

		this.saveError$.pipe(
			skip(1),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(err => {
			let m = "";
			if (err && err instanceof HttpErrorResponse) {
				if (err.status === 400 && ["EX1009", "EX4005"].indexOf(err.error.errorCode) !== -1)
					m = err.error.error;
				else
					m = err.error && typeof err.error === "string" ? err.error : err.message;
			}
			this.overlayService.showNotification$(m, "error");
		});
	}

	public openPopup(): void {
		this.store.dispatch(openPopupChangePassword());
		const component = this.overlayService.show(ProfileChangePasswordComponent, { inputs: { route: this.activatedRoute }, centerPosition: true });
		this.subscription = component.instance.close$.subscribe(() => this.overlayService.clear());
	}

	public getForm(): FormGroup {
		return this.formBuilder.group({
			login: this.formBuilder.control({ value: null, disabled: true }),
			lastName: [null, [Validators.required, Validators.maxLength(255)]],
			firstName: [null, [Validators.required, Validators.maxLength(255)]],
			middleName: [null, [Validators.maxLength(255)]],
			jobPost: [null, [Validators.maxLength(255)]],
			email: [null, [Validators.required, Validators.maxLength(255), Validators.email]],
			phoneNumber: [null, [Validators.maxLength(255)]],
			storage: [null],
			updateProfile: this.formBuilder.control({ value: null, disabled: true }),
			lastAuthorization: this.formBuilder.control({ value: null, disabled: true }),
			rememberLogin: [null]
		});
	}

	public nextStagePage(): void {
		if (!this.storagesListLoaded)
			this.updateStoragesListsFilter(this.storagesListFilter.page + 1);
	}

	public onStageFilterChange({ search }: { search: string }): void {
		this.updateStoragesListsFilter(1, search);
	}

	public ngOnDestroy(): void {
		if (this.subscription)
			this.subscription.unsubscribe();
		this.overlayService.clear();
		this.store.dispatch(resetStoragesList());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public markAsTouched(form: FormGroup): void {
		form.markAllAsTouched();
		this.changeDetectorRef.detectChanges();
	}

	public valueTransformFn(value: any): [any, string] {
		return [value.id, `${value.addressFull} ${value.storageName ? value.storageName : ""}`];
	}

	private updateStoragesListsFilter(page: number, stageName?: string, size?: number): void {
		const o = { ...this.storagesListFilter, page };
		if (stageName !== undefined) {
			this.store.dispatch(resetStoragesList());
			this.storagesListLoaded = false;
			o.search = stageName;
		}
		o.size = size || this.storagesListFilter.size;

		this.storagesListFilter = o;

		this.store.dispatch(updateStoragesListFilter({ page, size: o.size, searchText: o.search }));
	}
}
