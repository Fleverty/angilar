import { Subject, Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UserState } from "@app/user/user.reducer";
import { takeUntil, skip, take } from "rxjs/operators";
import { DraftType } from "@helper/abstraction/draft";
import { createSelector, Store, select } from "@ngrx/store";
import { Organization } from "@helper/abstraction/organization";
import { OverlayService } from "@core/overlay.service";
import { EinvoiceFormBuilderService } from "../services/einvoice-form-builder.service";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { EinvoiceTransformService } from "../services/einvoice-transform.service";
import { HttpErrorResponse } from "@angular/common/http";
import { saveEinvocieDraft, saveEinvocieDraftSuccess } from "../einvoice-actions/einvoice-draft.actions";
import { signEinvocieDraft, saveSignedEinvoiceDraftSuccess } from "../einvoice-actions/einvoice-sign.actions";
import { deleteEinvoice, deleteEinvoiceSuccess } from "../einvoice-actions/einvoice-delete.actions";
import { EinvoiceEditTotalSumsComponent } from "../einvoice-edit-total-sums/einvoice-edit-total-sums.component";
import { documentState } from "@helper/paths";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { EinvoiceParams } from "@helper/abstraction/einvoice";
import { Actions, ofType } from "@ngrx/effects";
import { resetEinvoice, resetEinvoiceDraftNumber } from "../einvoice-actions/einvoice-main.actions";
import { TranslationService } from "@core/translation.service";
import { signingDraftError } from "../../documents.actions";

@Component({
	selector: "app-einvoice",
	styleUrls: ["einvoice.component.scss"],
	templateUrl: "einvoice.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class EinvoiceComponent implements OnDestroy {
	public form$: Observable<FormGroup>;
	public draftType?: DraftType;
	public draftId?: string;
	public mode: "edit" | "create";
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR" | undefined>;
	public organizationInfo: Observable<Organization | undefined>;
	public errorProcessedDraftId?: string;

	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly actions: Actions,
		private router: Router,
		private overlayService: OverlayService,
		private readonly store: Store<EinvoiceState>,
		private readonly activatedRoute: ActivatedRoute,
		private readonly einvoiceFormBuilderService: EinvoiceFormBuilderService,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
		private readonly einvoiceTransformService: EinvoiceTransformService,
		private readonly translationService: TranslationService,
		private readonly userErrorsService: UserErrorsService,
		private readonly actions$: Actions
	) {
		const qp = this.activatedRoute.snapshot.queryParams;
		this.draftType = qp.draftType;
		this.draftId = qp.draftId;
		this.mode = this.router.url.split("/").reverse()[0].split("?")[0] as "edit" | "create";

		const selectFn$ = this.einvoiceSelectorService.select$.bind(this.einvoiceSelectorService);
		this.signingStatus$ = selectFn$(state => state.signingStatus);

		const selectUser = (appState: any): UserState => appState.user;
		const selectOrganizationInfo = createSelector(selectUser, (state: UserState): Organization | undefined => state.organizationInfo);
		this.organizationInfo = this.store.pipe(select(selectOrganizationInfo));

		if (!qp.draftType)
			throw Error("No DraftType");
		this.form$ = this.einvoiceFormBuilderService.getForm$(qp.draftType, qp.draftId, !!qp.isTest);

		// handle signing error and set id to document
		this.actions$.pipe(
			ofType(signingDraftError),
			take(1)
		).subscribe(action => this.errorProcessedDraftId = action.id);
	}

	public ngOnDestroy(): void {
		this.store.dispatch(resetEinvoice());
		this.store.dispatch(resetEinvoiceDraftNumber());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		const formValue = form.getRawValue();

		this.actions.pipe(
			ofType(saveEinvocieDraftSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => {
			this.goBack();
		});

		if (formValue.products.products.length === 0) {
			this.overlayService && this.overlayService.showNotification$(this.translationService.getTranslation("productsError") || "", "error");
		} else {
			this.store.dispatch(
				saveEinvocieDraft(this.einvoiceTransformService.toEinvoiceParams(formValue))
			);
		}
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.translationService.getTranslation("deletionPopupText") || "",
			this.translationService.getTranslation("ok"),
			this.translationService.getTranslation("cancel")
		).then((agree: boolean) => {
			if (agree && this.draftId)
				this.store.dispatch(deleteEinvoice(this.draftId));

			this.actions.pipe(
				ofType(deleteEinvoiceSuccess),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => {
				this.goBack();
			});
		});
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EINVOICE", documentState.draft]);
	}

	public signingDraft(form: FormGroup): void {
		if (!form || form.invalid) {
			const m = this.translationService.getTranslation("invalid");
			if (!m) throw Error("No message");
			this.overlayService.showNotification$(m, "error");
			return;
		}
		if (this.errorProcessedDraftId)
			form.patchValue({
				id: this.errorProcessedDraftId
			}, { emitEvent: false });

		if (!form.value.products.products.length) {
			this.overlayService && this.overlayService.showNotification$(this.translationService.getTranslation("productsError") || "", "error");
			return;
		}

		const errors$ = this.einvoiceSelectorService.select$((state: EinvoiceState): HttpErrorResponse | Error | undefined => state.signingError);
		errors$.pipe(skip(1), take(1), takeUntil(this.unsubscribe$$)).subscribe(
			err => {
				let m = "";
				if (err && err instanceof HttpErrorResponse)
					switch (err.status) {
						case 422:
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
							break;
						case 0:
							m = this.translationService.getTranslation("proxyUnavailable") || m;
							break;
						default:
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
							break;
					}
				this.overlayService.showNotification$(m, "error");
			}
		);

		this.store.dispatch(signEinvocieDraft(
			this.einvoiceTransformService.toEinvoiceParams(form.getRawValue()) as EinvoiceParams
		));
		this.errorProcessedDraftId = undefined;

		this.actions.pipe(
			ofType(saveSignedEinvoiceDraftSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe((action) => {
			this.router.navigate(["user", "documents", "EINVOICE", "sign-draft", action.id]);
		});
	}

	public changeSum(formGroup: FormGroup): void {
		const products = formGroup.get("products");
		const component = this.overlayService.show(
			EinvoiceEditTotalSumsComponent,
			{
				inputs: {
					form: products && products.get("totalSums")
				},
				centerPosition: true
			});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public markAsTouched(form: FormGroup): void {
		form.markAllAsTouched();
	}

	public submit(form: FormGroup): void {
		ValidatorsUtil.triggerValidation(form);
		if (form.invalid) {
			this.userErrorsService.displayErrors(form);
			return;
		}
		this.signingDraft(form);
	}
}
