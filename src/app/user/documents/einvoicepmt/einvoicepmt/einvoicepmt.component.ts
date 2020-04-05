import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { Observable, Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { EinvoicepmtFormBuilderService } from "@app/user/documents/einvoicepmt/einvoicepmt-form-builder.service";
import { ActivatedRoute } from "@angular/router";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { EinvoicepmtFormValue } from "@helper/abstraction/einvoicepmt";
import { OverlayService } from "@core/overlay.service";
import { EinvoicepmtTransformService } from "@app/user/documents/einvoicepmt/einvoicepmt-transform.service";
import { createSelector, select, Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import * as EinvoicepmtActions from "../einvoicepmt-store/einvoicepmt.actions";
import { TemplateUtil } from "@helper/template-util";
import * as DocumentActions from "@app/user/documents/documents.actions";
import { skip, takeUntil, take } from "rxjs/operators";
import { EinvoicepmtEditTotalSumsComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-edit-total-sums/einvoicepmt-edit-total-sums.component";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, ofType } from "@ngrx/effects";
import { saveSignedDraftSuccess } from "@app/user/documents/documents.actions";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt",
	templateUrl: "./einvoicepmt.component.html",
	styleUrls: ["./einvoicepmt.component.scss"]
})
export class EinvoicepmtComponent implements OnDestroy {
	public form$: Observable<FormGroup>;
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR" | undefined>;
	@ViewChild("popupMessage", { static: true }) public set messagesTemplate(elementTemplate: ElementRef) {
		this.messages = TemplateUtil.getMap(elementTemplate.nativeElement);
	}

	public get id(): string | null {
		return this.activatedRoute.snapshot.paramMap.get("id");
	}
	public messages: Map<string, string> = new Map<string, string>();
	public unsubscribe$$ = new Subject<void>();
	public errorProcessedDraftId?: string;

	constructor(
		private readonly userRoutingService: UserRoutingService,
		private readonly einvoicepmtFormBuilderService: EinvoicepmtFormBuilderService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly userErrorsService: UserErrorsService,
		private readonly overlayService: OverlayService,
		private readonly einvoicepmtTransformService: EinvoicepmtTransformService,
		private readonly store: Store<EinvoicepmtState>,
		private readonly actions$: Actions
	) {
		const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectEinvoicepmtSigningStatus = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState) => state.signingStatus);

		this.signingStatus$ = this.store.pipe(select(selectEinvoicepmtSigningStatus));
		this.form$ = this.einvoicepmtFormBuilderService.getForm$("BLRPMT", this.id, false);

		// handle signing error and set id to document
		this.actions$.pipe(
			ofType(DocumentActions.signingDraftError),
			take(1)
		).subscribe(action => this.errorProcessedDraftId = action.id );
	}

	public submit(form: FormGroup): void {
		ValidatorsUtil.triggerValidation(form);
		if (form.invalid) {
			this.userErrorsService.displayErrors(form);
			return;
		}
		this.signingDraft(form);
	}

	public fillWithSupplierHandler(form: FormGroup): void {
		const { supplier: { supplierName, supplierAddress, supplierGln, supplierUnp }} = form.getRawValue();
		(form.get("shipper") as FormGroup).setValue({
			shipperName: supplierName,
			shipperAddress: supplierAddress,
			shipperGln: supplierGln,
			shipperUnp: supplierUnp
		});
	}

	public fillWithBuyerHandler(form: FormGroup): void {
		const { buyer: { buyerName, buyerAddress, buyerGln, buyerUnp }} = form.getRawValue();
		(form.get("receiver") as FormGroup).setValue({
			receiverName: buyerName,
			receiverAddress: buyerAddress,
			receiverGln: buyerGln,
			receiverUnp: buyerUnp
		});
	}

	public changeSum(form: FormGroup): void {
		const products = form.get("products");
		const component = this.overlayService.show(
			EinvoicepmtEditTotalSumsComponent,
			{
				inputs: {
					form: products && products.get("totalSums")
				},
				centerPosition: true
			});
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public save(form: FormGroup): void {
		if (!form)
			throw Error("No form");
		const value: EinvoicepmtFormValue = form.getRawValue();

		if (value.products.products.length === 0) {
			this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
		} else {
			const data = this.einvoicepmtTransformService.toEinvoicepmtDto(value);
			this.store.dispatch(EinvoicepmtActions.resetEinvoicepmt());
			this.store.dispatch(EinvoicepmtActions.saveEinvoicepmtDraft(data));
		}
	}

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.messages.get("deletionPopupText") || "",
			this.messages.get("deletionPopupAgreeButton"),
			this.messages.get("deletionPopupDisagreeButton")
		).then((agree: boolean) => {
			if (agree && this.id)
				this.store.dispatch(EinvoicepmtActions.deleteEinvoicepmtDraft(+this.id, "BLRPMT"));
		});
	}

	public ngOnDestroy(): void {
		this.store.dispatch(EinvoicepmtActions.resetEinvoicepmt());
		this.store.dispatch(EinvoicepmtActions.resetEinvoicepmtDraftNumber());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private signingDraft(form: FormGroup): void {
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
			const value: EinvoicepmtFormValue = form.getRawValue();
			const draftType = "BLRPMT";

			if (!value)
				throw Error("No form");

			if (!value.products.products.length) {
				this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
				return;
			}

			const document = this.einvoicepmtTransformService.toEinvoicepmtDto(value);

			const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
			const selectSigngingError$ = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): HttpErrorResponse | Error | undefined => state.signingError);
			const signingErrors$ = this.store.pipe(select(selectSigngingError$));

			signingErrors$.pipe(skip(1), take(1), takeUntil(this.unsubscribe$$)).subscribe(
				err => {

					// черновик сохраняется в бд когда пытается подписаться, и айдиха уже есть
					// this.ewaybillSelectorService.select$(state => state.id).pipe(take(1)).subscribe(id => {
					// 	if (id) {
					// 		this.draftId = `${id}`;
					// 		this.mode = "edit";
					// 	}
					// });

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

			this.store.dispatch(DocumentActions.createDraftThenSignNewApi({
				draftType,
				document
			}));
			this.errorProcessedDraftId = undefined;

			this.actions$.pipe(
				ofType(saveSignedDraftSuccess),
				takeUntil(this.unsubscribe$$)
			).subscribe((action) => this.store.dispatch(EinvoicepmtActions.openSignedDraft(action.signedDraft)));
		} else {
			this.overlayService && this.overlayService.showNotification$(this.messages.get("productsError") || "", "error");
		}
	}
}
