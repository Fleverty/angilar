import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { createSelector, Store } from "@ngrx/store";
import { takeUntil, skip, take } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ExtraField, ExtraFieldsParams } from "@helper/abstraction/extra-fields";
import { EwaybillState } from "../ewaybill.reducer";
import { ExtraFieldForm } from "../ewaybill-extra-information/ewaybill-extra-information.component";
import { resetEwaybill, deleteEwaybillResponse, updateEwaybillResponse } from "../ewaybill.actions";
import { Ewaybill, EwaybillResponse } from "@helper/abstraction/ewaybill";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { EwaybillEditPopupComponent } from "../ewaybill-edit-popup/ewaybill-edit-popup.component";
import { Actions, ofType } from "@ngrx/effects";
import * as EwaybillActions from "./../ewaybill.actions";
import { MessageType } from "@helper/abstraction/documents";
import { HttpErrorResponse } from "@angular/common/http";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { ValidatorsUtil } from "@helper/validators-util";
import { UserState } from "@app/user/user.reducer";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { documentState } from "@helper/paths";

export interface ActsFormValue {
	actDate: Date;
	actNumber: number;
	actName: string;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-response-draft",
	templateUrl: "./ewaybill-response-draft.component.html",
	styleUrls: ["../ewaybill-view.scss", "./ewaybill-response-draft.component.scss"]
})

export class EwaybillResponseDraftComponent implements OnInit {
	public readonly ADDITIONAL_FIELDS_DRAFT_TYPE = "BLRWBR";

	public get ewaybillResponse(): EwaybillResponse {
		return this.activatedRoute.snapshot.data.document;
	}
	public get type(): MessageType {
		return this.activatedRoute.snapshot.paramMap.get("type") as MessageType;
	}
	public get id(): string | null {
		return this.activatedRoute.snapshot.paramMap.get("id");
	}

	public isSaveClicked = false;
	public form: FormGroup;
	public isAddDocumentClicked = false;
	public isAddExtraFieldClicked = false;
	public responseExtraFields$?: Observable<[ExtraField, string][] | undefined>;
	public responseExtraFieldsFilter: ExtraFieldsParams = {
		page: 0,
		size: 30,
	};
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR">;
	public messages: Map<string, string> = new Map<string, string>();
	@ViewChild("texts", { static: true }) public texts?: ElementRef<HTMLTemplateElement>;
	@ViewChild("editPopup", { static: false }) private overlayComponent?: OverlayComponent;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly actions$: Actions,
		private readonly store: Store<EwaybillState>,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly overlayService: OverlayService,
		private readonly formBuilder: FormBuilder,
		private readonly userFilterService: UserFilterService<UserState>,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly userErrorService: UserErrorsService
	) {
		if (!this.type || !this.id)
			throw Error("No params");

		const selectState = (appState: any): EwaybillState => appState.ewaybill;

		this.form = this.getForm(this.ewaybillResponse);

		const selectorStatus = createSelector(selectState, (state: EwaybillState): "PENDING" | "OK" | "ERROR" => state.signingStatus);
		this.signingStatus$ = this.store.select(selectorStatus);
	}

	public ngOnInit(): void {
		this.responseExtraFields$ = this.ewaybillSelectorService.selectDictionariesFromStore$<ExtraField>(
			(extraField: ExtraField): string => `${extraField.fieldCode} ${extraField.fieldName}`,
			(state: EwaybillState): ExtraField[] | undefined => state.responseExtraFields
		);

		this.updateExtraFieldsFilter("");
	}

	public ngAfterViewInit(): void {
		if (!this.texts)
			throw Error("No template!");
		this.messages = TemplateUtil.getMap(this.texts.nativeElement);
	}

	public get acts(): FormArray | undefined {
		return this.form && (this.form.controls.acts as FormGroup).controls.documents as FormArray;
	}

	public get extraFields(): FormArray | undefined {
		return this.form && (this.form.controls.extras as FormGroup).controls.documents as FormArray;
	}

	public prevPage(): void {
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft]);
	}

	public updateExtraFieldsFilter(extraFieldName?: string): void {
		if (this.responseExtraFieldsFilter.searchText !== extraFieldName)
			this.userFilterService.updateFilter(this.responseExtraFieldsFilter, EwaybillActions.resetResponseExtraFields, EwaybillActions.updateResponseExtraFieldsFilter, extraFieldName);
	}

	public signing(): void {
		if (this.form.invalid) {
			ValidatorsUtil.triggerValidation(this.form);
			this.userErrorService.displayErrors(this.form);
			return;
		}

		this.updateEwaybillResponse();

		if (this.ewaybillResponse && this.ewaybillResponse.id && this.ewaybillResponse.msgType) {
			const draftId = +this.ewaybillResponse.id;
			const messageType = this.ewaybillResponse.msgType;

			this.actions$.pipe(
				ofType(EwaybillActions.updateEwaybillResponseSuccess),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => this.store.dispatch(EwaybillActions.findXmlThenSign({ messageType, draftId })));

			this.ewaybillSelectorService.select$((state): HttpErrorResponse | Error | undefined => state.errorFindXmlThenSign).pipe(
				skip(1),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(
				err => {
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

			this.actions$.pipe(
				ofType(EwaybillActions.validateAndSaveSignedSuccess),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => {
				this.router.navigate(["user", "documents", "EWAYBILL", "response", "sign-draft", messageType, draftId]);
			});
		}
		else
			throw Error("No draft id or msgType");
	}

	public edit(): void {
		if (this.ewaybillResponse && this.ewaybillResponse.msgEwaybill && !this.ewaybillResponse.msgEwaybill.id)
			throw Error("No ewaybillId");

		if (!this.overlayComponent) {
			throw Error("No overlay component");
		}

		const component = this.overlayComponent.show(EwaybillEditPopupComponent, { inputs: { id: this.ewaybillResponse.msgEwaybill.id }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayComponent && this.overlayComponent.destroy());
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.messages.get("deletionPopupText") || "",
			this.messages.get("deletionPopupAgreeButton"),
			this.messages.get("deletionPopupDisagreeButton")
		).then((state: boolean) => {
			if (state && this.id) {
				this.store.dispatch(deleteEwaybillResponse(this.type, this.id));
			}
		});
	}

	public save(): void {
		this.updateEwaybillResponse();

		this.actions$.pipe(
			ofType(EwaybillActions.updateEwaybillResponseSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.prevPage());
	}

	public updateEwaybillResponse(): void {
		const extras = this.form && this.form.get("extras") as FormGroup;
		const acts = this.form && this.form.get("acts") as FormGroup;
		const accept = this.form && this.form.get("accept") as FormGroup;
		const response: any = {
			...this.ewaybillResponse,
			msgEwaybillExtraFieldList: extras && extras.getRawValue().documents.filter((e: ExtraField) => e.fieldCode && e.fieldName && e.fieldValue),
			receiverSealNumber: accept && accept.getRawValue().receiverSealNumber,
			shipTo: {
				...this.ewaybillResponse.shipTo,
				contact: accept && accept.getRawValue().shipToContact
			}
		};
		if (this.type === this.ADDITIONAL_FIELDS_DRAFT_TYPE)
			response.msgEwaybillResponseActDtoList = acts && acts.getRawValue().documents.filter((e: ActsFormValue) => e.actDate && e.actNumber && e.actName);
		this.store.dispatch(updateEwaybillResponse(this.type, response));
	}

	public getForm(initValue?: Ewaybill): FormGroup {
		return this.formBuilder.group({
			accept: this.formBuilder.group({
				shipToContact: [initValue && initValue.shipTo && initValue.shipTo.contact || null, Validators.required],
				receiverSealNumber: [initValue && initValue.receiverSealNumber || null]
			}),
			acts: this.formBuilder.group({
				documents: this.formBuilder.array((initValue && initValue.msgEwaybillResponseActDtoList || []).map((document: ActsFormValue) => this.getActForm(document))),
			}),
			extras: this.formBuilder.group({
				documents: this.formBuilder.array((initValue && initValue.msgEwaybillExtraFieldList || []).map((document: ExtraFieldForm) => this.getExtraFieldForm(document))),
			}),
		});
	}

	public getActForm(initValue?: ActsFormValue): FormGroup {
		return this.formBuilder.group({
			actDate: [initValue && initValue.actDate, Validators.required],
			actNumber: [initValue && initValue.actNumber, Validators.required],
			actName: [initValue && initValue.actName, Validators.required],
		});
	}

	public getExtraFieldForm(initValue?: ExtraFieldForm): FormGroup {
		return this.formBuilder.group({
			dictionary: [null],
			fieldName: [initValue && initValue.fieldName, Validators.required],
			fieldValue: [initValue && initValue.fieldValue, Validators.required],
			fieldCode: [initValue && initValue.fieldCode]
		});
	}

	public addDocument(initValue?: ActsFormValue): void {
		const lastIndex = this.acts && this.acts.length - 1 || 0;
		if (lastIndex === -1 || this.acts && this.acts.at(lastIndex).valid) {
			this.isAddDocumentClicked = false;
			this.acts && this.acts.push(this.getActForm(initValue));
		} else {
			this.isAddDocumentClicked = true;
		}
	}

	public addExtraField(initValue?: ExtraFieldForm): void {
		let lastIndex = this.extraFields && this.extraFields.length - 1 || 0;
		if (lastIndex === -1 || this.extraFields && this.extraFields.at(lastIndex).valid) {
			this.isAddExtraFieldClicked = false;
			this.extraFields && this.extraFields.push(this.getExtraFieldForm(initValue));
			lastIndex++;
			this.extraFields && (this.extraFields.at(lastIndex) as FormGroup).controls.dictionary.valueChanges.pipe(
				takeUntil(this.unsubscribe$$),
			).subscribe((value: ExtraField) => {
				this.extraFields && this.extraFields.at(lastIndex).patchValue({
					fieldName: value && value.fieldName,
					fieldCode: value && value.fieldCode
				});
			});
		} else {
			this.isAddExtraFieldClicked = true;
		}
		this.changeDetectorRef.detectChanges();
	}

	public ngOnDestroy(): void {
		this.overlayService.clear();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.store.dispatch(resetEwaybill());
	}
}
