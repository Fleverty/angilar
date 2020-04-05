import { Observable, Subject } from "rxjs";
import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	ViewChild,
	ElementRef,
	AfterViewInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { createSelector, select, Store } from "@ngrx/store";

import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillEditTotalSumsComponent } from "../ewaybill-edit-total-sums/ewaybill-edit-total-sums.component";
import { takeUntil, take, skip } from "rxjs/operators";
import { CurrenciesParams, Currency } from "@helper/abstraction/currency";
import { ConsigneesParams, Consignee } from "@helper/abstraction/consignee";
import { GeneralGLN, GeneralGLNsParams } from "@helper/abstraction/generalGLN";
import { LoadingPoint } from "@helper/abstraction/loading-points";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { ExtraField, ExtraFieldsParams } from "@helper/abstraction/extra-fields";
import { notNull } from "@helper/operators";
import { TemplateUtil } from "@helper/template-util";
import { DocumentState } from "@helper/abstraction/documents";
import { EwaybillFormBuilderService } from "./ewaybill-form-builder.service";
import { TypedStoragesParams } from "@helper/abstraction/storages";
import { saveSignedDraftSuccess } from "../../documents.actions";
import { HttpErrorResponse } from "@angular/common/http";
import { DraftType } from "@helper/abstraction/draft";
import * as EwaybillActions from "../ewaybill.actions";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { Actions, ofType } from "@ngrx/effects";
import * as DocumentActions from "./../../documents.actions";
import { EwaybillForm } from "./ewaybill-form";
import { EwaybillTransformService } from "../ewaybill-transform.service";
import { Organization } from "@helper/abstraction/organization";
import { UserState } from "@app/user/user.reducer";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	selector: "app-ewaybill",
	styleUrls: ["ewaybill.component.scss"],
	templateUrl: "ewaybill.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class EwaybillComponent implements AfterViewInit, OnDestroy {
	public form$: Observable<FormGroup>;
	public draftType?: DraftType;
	public draftId?: string;
	public testIndicator?: boolean;
	public mode: "edit" | "create";
	public currenciesFilter: CurrenciesParams = {
		page: 0,
		size: 30,
	};
	public consigneeFilter: ConsigneesParams = {
		page: 0,
		size: 30,
		documentTypeId: "EWAYBILL",
	};
	public glnFilter: GeneralGLNsParams = {
		page: 0,
		size: 30,
	};
	public loadingPointsFilter: TypedStoragesParams = {
		page: 0,
		size: 30,
		documentTypeId: "EWAYBILL",
		storageTypeId: "LOADING_PLACE"
	};
	public unloadPointsFilter: TypedStoragesParams = {
		page: 0,
		size: 30,
		documentTypeId: "EWAYBILL",
		storageTypeId: "UNLOADING_PLACE"
	};
	public extraFieldsFilter: ExtraFieldsParams = {
		page: 0,
		size: 30,
	};
	public prevDocumentState?: DocumentState;
	public currencies$?: Observable<[Currency, string][]>;
	public consignees$?: Observable<[Consignee, string][] | undefined>;
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR" | undefined>;
	public generalGLNs$?: Observable<[GeneralGLN, string][] | undefined>;
	public loadingPoints$?: Observable<[LoadingPoint, string][] | undefined>;
	public unloadingPoints$?: Observable<[UnloadingPoint, string][] | undefined>;
	public extraFields$?: Observable<[ExtraField, string][] | undefined>;
	public organizationInfo: Observable<Organization | undefined>;
	@ViewChild("popupMessage", { static: true }) public popupMessage?: ElementRef<HTMLTemplateElement>;
	public messages: Map<string, string> = new Map<string, string>();
	public errorProcessedDraftId?: string;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private router: Router,
		private overlayService: OverlayService,
		private readonly store: Store<EwaybillState>,
		private readonly documentsStore: Store<DocumentState>,
		private readonly activatedRoute: ActivatedRoute,
		private readonly ewaybillFormBuilderService: EwaybillFormBuilderService,
		private readonly userFilterService: UserFilterService<UserState>,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly ewaybillTransformService: EwaybillTransformService,
		private readonly actions$: Actions,
		private readonly userErrorsService: UserErrorsService,
		private readonly userRoutingService: UserRoutingService
	) {
		const selectFn$ = this.ewaybillSelectorService.select$.bind(this.ewaybillSelectorService);
		const selectUser = (appState: any): UserState => appState.user;

		this.signingStatus$ = selectFn$(state => state.signingStatus).pipe(takeUntil(this.unsubscribe$$));
		const selectOrganizationInfo = createSelector(selectUser, (state: UserState): Organization | undefined => state.organizationInfo);
		this.mode = this.router.url.split("/").reverse()[0].split("?")[0] as "edit" | "create";

		this.organizationInfo = this.store.pipe(select(selectOrganizationInfo));

		const qp = this.activatedRoute.snapshot.queryParams;
		this.draftType = qp.draftType;
		this.draftId = qp.draftId;

		if (!qp.draftType)
			throw Error("No DraftType");
		this.form$ = this.ewaybillFormBuilderService.getForm$(qp.draftType, qp.draftId, !!qp.isTest);

		selectFn$(state => state.validationError).pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((err: HttpErrorResponse | undefined) => {
			if (err && err.error) {
				this.overlayService && this.overlayService.showNotification$(err.error.error, "error");
			}
		});

		this.form$.pipe(
			notNull(),
			take(1),
			takeUntil(this.unsubscribe$$),
		).subscribe((form) => {
			const ti = form.get("testIndicator");
			this.testIndicator = ti && ti.value;

			this.currencies$ = this.ewaybillSelectorService.selectDictionariesFromStore$<Currency>(
				(currency: Currency): string => `${currency.code} (${currency.name})`,
				(state: EwaybillState): Currency[] | undefined => state.currencies
			).pipe(takeUntil(this.unsubscribe$$));
			this.consignees$ = this.ewaybillSelectorService.selectDictionariesFromStore$<Consignee>(
				(consignee: Consignee): string => `${consignee.name}`,
				(state: EwaybillState): Consignee[] | undefined => state.consignees
			).pipe(takeUntil(this.unsubscribe$$));
			this.generalGLNs$ = this.ewaybillSelectorService.selectDictionariesFromStore$<GeneralGLN>(
				(generalGLN: GeneralGLN): string => `${generalGLN.address} ${generalGLN.gln}`,
				(state: EwaybillState): GeneralGLN[] | undefined => state.generalGLNs
			).pipe(takeUntil(this.unsubscribe$$));
			this.loadingPoints$ = this.ewaybillSelectorService.selectDictionariesFromStore$<LoadingPoint>(
				(loadingPoint: LoadingPoint): string => [loadingPoint.addressFull, loadingPoint.storageName].filter(e => !!e).join(", "),
				(state: EwaybillState): LoadingPoint[] | undefined => state.loadingPoints
			).pipe(takeUntil(this.unsubscribe$$));
			this.unloadingPoints$ = this.ewaybillSelectorService.selectDictionariesFromStore$<UnloadingPoint>(
				(unloadingPoints: LoadingPoint): string => [unloadingPoints.addressFull, unloadingPoints.storageName].filter(e => !!e).join(", "),
				(state: EwaybillState): UnloadingPoint[] | undefined => state.unloadingPoints
			).pipe(takeUntil(this.unsubscribe$$));
			this.extraFields$ = this.ewaybillSelectorService.selectDictionariesFromStore$<ExtraField>(
				(extraField: ExtraField): string => `${extraField.fieldName}`,
				(state: EwaybillState): ExtraField[] | undefined => state.extraFields
			).pipe(takeUntil(this.unsubscribe$$));

			this.updateCurrencyFilter("");
			this.updateConsigneeFilter("");
			this.updateGeneralGLNsFilter("");
			this.updateLoadingPointsFilter("");
			this.updateUnloadingPointsFilter("");
			this.updateExtraFieldsFilter("");

			if (this.mode === "edit") {
				const c = form.get("сonsignee") as FormGroup;
				c && this.onReceiverFormValueChanges(c.getRawValue());
			}
		});

		// handle signing error and set id to document
		this.actions$.pipe(
			ofType(DocumentActions.signingDraftError),
			take(1)
		).subscribe(action => this.errorProcessedDraftId = action.id );

	}

	public ngAfterViewInit(): void {
		if (!this.popupMessage)
			throw Error("No template!");
		this.messages = TemplateUtil.getMap(this.popupMessage.nativeElement);
	}

	public ngOnDestroy(): void {
		this.store.dispatch(EwaybillActions.resetEwaybill());
		this.store.dispatch(EwaybillActions.resetValidationError());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public fillWithHandler(form: FormGroup, fillWith: "CUSTOMER" | "PROVIDER"): void {
		if (!form)
			throw Error("No Form provided!");

		if (fillWith === "CUSTOMER") {
			const { name, address, gln, unp, dictionary } = form && (form.get("сonsignee") as FormGroup).getRawValue();
			form && (form.get("customer") as FormGroup).patchValue({ name, address, gln, unp, dictionary });
		}

		if (fillWith === "PROVIDER") {
			this.organizationInfo.pipe(notNull(), take(1), takeUntil(this.unsubscribe$$)).subscribe((organization: Organization) => {
				form && (form.get("customer") as FormGroup).patchValue({
					name: organization.name,
					address: organization.addressFull,
					gln: organization.gln,
					unp: organization.unp
				});
			});
		}
	}

	public onReceiverFormValueChanges(formValue: any, form?: FormGroup): void {
		if (formValue && formValue.dictionary && formValue.dictionary.id === this.unloadPointsFilter.partnerId)
			return;
		this.unloadPointsFilter.partnerId = (formValue.dictionary || {}).id;
		if (form && form.get("places.unloading"))
			(form.get("places.unloading") as FormGroup).reset({}, { emitEvent: false });
		this.updateUnloadingPointsFilter("");
	}

	public updateConsigneeFilter(consigneeName?: string): void {
		this.userFilterService.updateFilter(this.consigneeFilter, EwaybillActions.resetConsignees, EwaybillActions.updateConsigneesFilter, consigneeName);
	}

	public updateCurrencyFilter(currencyName?: string): void {
		this.userFilterService.updateFilter(this.currenciesFilter, EwaybillActions.resetCurrencies, EwaybillActions.updateCurrenciesFilter, currencyName);
	}

	public updateGeneralGLNsFilter(glnName?: string): void {
		this.userFilterService.updateFilter(this.glnFilter, EwaybillActions.resetGeneralGLNs, EwaybillActions.updateGeneralGLNsFilter, glnName);
	}

	public updateLoadingPointsFilter(storageName?: string): void {
		this.userFilterService.updateFilter(this.loadingPointsFilter, EwaybillActions.resetLoadingPoints, EwaybillActions.updateLoadingPointsFilter, storageName);
	}

	public updateUnloadingPointsFilter(storageName?: string): void {
		this.userFilterService.updateFilter(this.unloadPointsFilter, EwaybillActions.resetUnloadingPoints, EwaybillActions.updateUnloadingPointsFilter, storageName);
	}

	public updateExtraFieldsFilter(extraFieldName?: string): void {
		this.userFilterService.updateFilter(this.extraFieldsFilter, EwaybillActions.resetExtraFields, EwaybillActions.updateExtraFieldsFilter, extraFieldName);
	}

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		const value: EwaybillForm = form.getRawValue();

		if (value.products.products.length === 0) {
			this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
		} else {

			if (this.draftId) {
				value.id = this.draftId;
			}
			if (this.draftType) {
				const doc = this.ewaybillTransformService.toEwaybillDocument(value, this.draftType);
				if (this.draftType === "BLRWBL") {
					this.store.dispatch(EwaybillActions.saveTransportDocument(doc));
				} else {
					this.store.dispatch(EwaybillActions.saveDocument(doc));
				}
			}
		}
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.messages.get("deletionPopupText") || "",
			this.messages.get("deletionPopupAgreeButton"),
			this.messages.get("deletionPopupDisagreeButton")
		).then((agree: boolean) => {
			if (agree && this.draftType && this.draftId)
				this.store.dispatch(EwaybillActions.deleteEwaybill(this.draftType, this.draftId));
		});
	}

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}

	public changeSum(formGroup: FormGroup): void {
		const products = formGroup.get("products");
		const component = this.overlayService.show(
			EwaybillEditTotalSumsComponent,
			{
				inputs: {
					form: products && products.get("totalSums")
				},
				centerPosition: true
			});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public signingDraft(form: FormGroup): void {
		if (!form || form.invalid) {
			const m = this.messages.get("invalid");
			if (!m) throw Error("No message");
			this.overlayService.showNotification$(m, "error");
			return;
		}
		if (this.errorProcessedDraftId)
			form.patchValue({
				id: this.errorProcessedDraftId
			}, { emitEvent: false });

		if (form.valid) {
			const value: EwaybillForm = form.getRawValue();

			if (!value || !this.draftType)
				throw Error("No form");

			if (!value.products.products.length) {
				this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
				return;
			}

			const document = this.ewaybillTransformService.toEwaybillDocument(value, this.draftType);

			const errors$ = this.ewaybillSelectorService.select$((state: EwaybillState): HttpErrorResponse | Error | undefined => state.signingError);
			errors$.pipe(skip(1), take(1), takeUntil(this.unsubscribe$$)).subscribe(
				err => {

					// черновик сохраняется в бд когда пытается подписаться, и айдиха уже есть
					this.ewaybillSelectorService.select$(state => state.id).pipe(take(1)).subscribe(id => {
						if (id) {
							this.draftId = `${id}`;
							this.mode = "edit";
						}
					});

					let m = "";
					if (err && err instanceof HttpErrorResponse)
						switch (err.status) {
							case 422:
								m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
								break;
							case 0:
								m = this.messages.get("proxyUnavailable") || m;
								break;
							default:
								m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
								break;
						}

					this.overlayService.showNotification$(m, "error");
				}
			);

			this.documentsStore.dispatch(DocumentActions.createDraftThenSign({
				draftType: this.draftType,
				document
			}));
			this.errorProcessedDraftId = undefined;

			this.actions$.pipe(
				ofType(saveSignedDraftSuccess),
				takeUntil(this.unsubscribe$$)
			).subscribe((action) => this.store.dispatch(DocumentActions.openSignedDraft(action.signedDraft)));
		} else {
			this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
		}
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
