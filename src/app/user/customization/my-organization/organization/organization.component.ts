import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store, select, createSelector } from "@ngrx/store";
import { CustomizationState } from "../../customization.reducer";
import {
	changeOrganization,
	saveOrganization,
	cancelSaveOrganization,
	recordOrganization,
	setOrganizationFormValidation
} from "../../customization.actions";
import { Observable, Subject } from "rxjs";
import { Organization } from "@helper/abstraction/organization";
import { takeUntil, filter, withLatestFrom } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { Router, NavigationStart } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { UserState } from "@app/user/user.reducer";

@Component({
	selector: "app-organization",
	templateUrl: "./organization.component.html",
	styleUrls: ["./organization.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationComponent implements OnInit {
	public organization$: Observable<Organization | undefined>;
	public organizationUserState$: Observable<Organization | undefined>;
	public persistent$: Observable<boolean | undefined>;
	public form: FormGroup;
	@ViewChild("popupMessage", { static: true }) public popupMessage?: ElementRef<HTMLTemplateElement>;
	public messages?: Map<string, string>;
	private unsubscribe$$ = new Subject<void>();
	private prevFormValidation?: boolean;

	constructor(
		private readonly store: Store<CustomizationState>,
		private readonly formBuilder: FormBuilder,
		private readonly router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly overlayService: OverlayService,
	) {
		const user = (appState: any): UserState => appState.user;
		const organizationUserState = createSelector(user, (state: UserState): Organization | undefined => state.organizationInfo);
		this.organizationUserState$ = this.store.pipe(select(organizationUserState));

		const section = (appState: any): CustomizationState => appState.customization;
		const organizationInfo = createSelector(section, (state: CustomizationState): Organization | undefined => state.organizationInfo);
		this.organization$ = this.store.pipe(select(organizationInfo));

		const isChangeOrganizationInfo = createSelector(section, (state: CustomizationState): boolean | undefined => state.isChangeOrganizationInfo);
		this.persistent$ = this.store.pipe(select(isChangeOrganizationInfo));

		const baseUrl = "/user/customization/organization";

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
						this.store.dispatch(saveOrganization());
						this.persistent$.pipe(
							filter(persistent => persistent === false),
							takeUntil(this.unsubscribe$$)
						).subscribe(() => this.router.navigateByUrl(newUrl));
					} else {
						this.store.dispatch(cancelSaveOrganization());
						this.router.navigateByUrl(newUrl);
					}
				});
			else
				throw Error("No ask or agree");
		});

		this.form = this.getForm();
		this.organizationUserState$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(organization => {
			this.store.dispatch(recordOrganization(organization));
			this.form.reset(organization, { emitEvent: false });
			this.form.updateValueAndValidity({ emitEvent: false });
		});

		this.form.statusChanges.pipe(filter(() => this.form.valid !== this.prevFormValidation)).subscribe(() => {
			this.prevFormValidation = this.form.valid;
			this.store.dispatch(setOrganizationFormValidation(this.form.valid));
		});
	}

	public ngAfterViewInit(): void {
		if (!this.popupMessage)
			throw Error("No popupMessage");
		this.messages = TemplateUtil.getMap(this.popupMessage.nativeElement);
	}

	public ngOnInit(): void {
		this.form.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(data => {
			this.store.dispatch(changeOrganization(data));
		});
	}

	public getForm(): FormGroup {
		return this.formBuilder.group({
			gln: this.formBuilder.control({ value: null, disabled: true }),
			groupPartyName: this.formBuilder.control({ value: null, disabled: true }),
			legalName: this.formBuilder.control({ value: null, disabled: true }),
			name: this.formBuilder.control({ value: null, disabled: true }),
			addressFull: this.formBuilder.control({ value: null, disabled: true }),
			unp: this.formBuilder.control({ value: null, disabled: true }),
			nsiMnsName: this.formBuilder.control({ value: null, disabled: true }),
			structureBelonging: [null, [Validators.maxLength(255)]],
			directorFullName: [null, [Validators.maxLength(255)]],
			directorBase: [null, [Validators.maxLength(255)]],
			partyCodeInErp: [null, [Validators.maxLength(35)]],
			description: [null, [Validators.maxLength(255)]],

			bankName: this.formBuilder.control({ value: null, disabled: true }),
			bankAddress: this.formBuilder.control({ value: null, disabled: true }),
			accountNumber: this.formBuilder.control({ value: null, disabled: true }),
			bankCode: this.formBuilder.control({ value: null, disabled: true }),

			contactLastName: [null, [Validators.required, Validators.maxLength(255)]],
			contactFirstName: [null, [Validators.required, Validators.maxLength(255)]],
			contactMiddleName: [null, [Validators.maxLength(255)]],
			contactJobPost: [null, [Validators.maxLength(255)]],
			contactEmail: [null, [Validators.required, Validators.maxLength(255), Validators.email]],
			contactPhone: [null, [Validators.maxLength(255)]],
			dateUpdate: this.formBuilder.control({ value: null, disabled: true }),
			id: [null],
			ewaybillProviderCode: [null]
		});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
