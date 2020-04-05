import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createSelector, select, Store } from "@ngrx/store";
import { UserState } from "@app/user/user.reducer";
import { DraftType } from "@helper/abstraction/draft";
import { Observable, combineLatest } from "rxjs";
import { map, take } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { ValidatorsUtil } from "@helper/validators-util";
import { EinvoicepmtDto, EinvoicepmtProductDto, ExtraFieldForm } from "@helper/abstraction/einvoicepmt";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { getEinvoicepmtDocumentDraft, getEinvoicepmtDraftNumber } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.actions";

@Injectable()
export class EinvoicepmtFormBuilderService {
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly store$: Store<UserState>
	) { }

	public userSelectFn = (appState: any): UserState => appState.user;
	public einvoicepmtSelectFn = (appState: any): EinvoicepmtState => appState.einvoicepmt;

	public getEinvoicepmtCommonForm(einvoicepmt?: EinvoicepmtDto): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const invoicepmtNumber = einvoicepmt && einvoicepmt.invoicepmtNumber && einvoicepmt.invoicepmtNumber.split("-") || [];
		return this.formBuilder.group({
			processingStatus: e.processingStatus || null,
			dateCreate: this.formBuilder.control({ value: e.supplierData && e.supplierData.dateCreate  ? new Date(e.supplierData.dateCreate) : new Date(), disabled: true }),
			invoicepmtNumber1: this.formBuilder.control({ value: invoicepmtNumber[0], disabled: true }),
			invoicepmtNumber2: this.formBuilder.control({ value: invoicepmtNumber[1], disabled: true }),
			invoicepmtNumber3: [invoicepmtNumber[2], Validators.required],
			invoicepmtDate: [e.invoicepmtDate ? new Date(e.invoicepmtDate) : new Date(), Validators.required],
			contractNumber: [e.contractNumber, Validators.maxLength(13)],
			contractDate: e.contractDate ? new Date(e.contractDate) : null,
			currency: [e.currency || { id: 1, code: "BYN", name: "Белорусский рубль" }, Validators.required],
			expireDate: e.expireDate ? new Date(e.expireDate) : null,
			paymentTerm: [e.paymentTerm, Validators.maxLength(512)],
			purchaseTarget: [e.buyingFor, Validators.maxLength(512)],
			deliveryTerms: [e.deliveryTerm, Validators.maxLength(512)],
			deliveryTime: [e.deliveryTime, Validators.maxLength(512)],
			testIndicator: e.testIndicator || false
		});
	}

	public getEinvoicepmtSupplierForm(einvoicepmt?: EinvoicepmtDto): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const s = e && e.supplier;
		return this.formBuilder.group({
			supplierName: this.formBuilder.control({ value: s && s.name, disabled: true }, { validators: [Validators.maxLength(175), Validators.required] }),
			supplierAddress: this.formBuilder.control({ value: s && s.address, disabled: true }, { validators: Validators.maxLength(140) }),
			supplierGln: this.formBuilder.control({ value: s && s.gln, disabled: true }, { validators: [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN()] }),
			supplierUnp: this.formBuilder.control({ value: s && s.unp, disabled: true }, { validators: Validators.maxLength(70) }),
			supplierOkpo: [s && s.okpo, Validators.maxLength(12)],
			supplierAccountNumber: this.formBuilder.control({ value: s && s.accountNumber, disabled: true }, { validators: Validators.maxLength(25) }),
			supplierBankName: this.formBuilder.control({ value: s && s.bankName, disabled: true }, { validators: Validators.maxLength(140) }),
			supplierBankAddress: this.formBuilder.control({ value: s && s.bankAddress, disabled: true }, { validators: Validators.maxLength(140) }),
			supplierBankCode: this.formBuilder.control({ value: s && s.bankCode, disabled: true }, { validators: Validators.maxLength(25) }),
		});
	}

	public getEinvoicepmtBuyerForm(einvoicepmt?: Partial<EinvoicepmtDto>): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const b = e && e.buyer;
		return this.formBuilder.group({
			dictionary: [b && b.id ? {
				name: b.name,
				address: b.address,
				gln: b.gln,
				unp: b.unp,
				okpo: b.okpo,
				bankName: b.bankName,
				accountNumber: b.accountNumber,
				bankAddress: b.bankAddress,
				bankCode: b.bankCode
			} : null, Validators.required],
			buyerName: [b && b.name],
			buyerAddress: this.formBuilder.control({ value: b && b.address || null, disabled: true }, { validators: [Validators.maxLength(140), Validators.required] }),
			buyerGln: this.formBuilder.control({ value: b && b.gln || null, disabled: true }, { validators: [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN(), Validators.required] }),
			buyerUnp: this.formBuilder.control({ value: b && b.unp || null, disabled: true }, { validators: [Validators.maxLength(70), Validators.required] }),
			buyerOkpo: [b && b.okpo, Validators.maxLength(12)],
			buyerAccountNumber: this.formBuilder.control({ value: b && b.accountNumber || null, disabled: true }, { validators: Validators.maxLength(25) }),
			buyerBankName: this.formBuilder.control({ value: b && b.bankName || null, disabled: true }, { validators: Validators.maxLength(140) }),
			buyerBankAddress: this.formBuilder.control({ value: b && b.bankAddress || null, disabled: true }, { validators: Validators.maxLength(140) }),
			buyerBankCode: this.formBuilder.control({ value: b && b.bankCode || null, disabled: true }, { validators: Validators.maxLength(25) }),
		});
	}

	public getEinvoicepmtShipperForm(einvoicepmt?: Partial<EinvoicepmtDto>): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const s = e && e.shipper;
		return this.formBuilder.group({
			shipperName: [s && s.name, Validators.maxLength(175)],
			shipperAddress: [s && s.address || null, Validators.maxLength(140)],
			shipperGln: [s && s.gln || null, [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN()]],
			shipperUnp: [s && s.unp || null, Validators.maxLength(70)]
		});
	}

	public getEinvoicepmtReceiverForm(einvoicepmt?: Partial<EinvoicepmtDto>): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const r = e && e.receiver;
		return this.formBuilder.group({
			receiverName: [r && r.name, Validators.maxLength(175)],
			receiverAddress: [r && r.address, Validators.maxLength(140)],
			receiverGln: [r && r.gln, [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN()]],
			receiverUnp: [r && r.unp, Validators.maxLength(70)],
		});
	}

	public getEinvoicepmtAdditionalFieldForm(value?: ExtraFieldForm, dictionaryName?: string): FormGroup {
		return this.formBuilder.group({
			dictionary: [dictionaryName ? { fieldName: dictionaryName } : null],
			fieldName: [value && value.fieldName, [Validators.required, Validators.maxLength(255)]],
			fieldValue: [value && value.fieldValue, [Validators.required, Validators.maxLength(2560)]],
			fieldCode: [value && value.fieldCode, Validators.maxLength(6)]
		});
	}

	public getEinvoicepmtProductForm(product?: EinvoicepmtProductDto, autoSum?: boolean): FormGroup {
		const p = product || {} as Partial<EinvoicepmtProductDto> & { autoSum?: boolean };
		const form = this.formBuilder.group({
			position: this.formBuilder.control({ value: p.position, disabled: true }),
			gtin: [p.gtin, [Validators.maxLength(14), ValidatorsUtil.checkSumGTIN()]],
			fullName: [p.fullName, [Validators.required, Validators.maxLength(512)]],
			uom: [p.uom, Validators.required],
			quantityDespatch: [p.quantityDespatch, Validators.required || null],
			codeByBuyer: [p.codeByBuyer, Validators.maxLength(35)],
			codeBySupplier: [p.codeBySupplier, Validators.maxLength(35)],
			addInfo: [p.addInfo, Validators.maxLength(512)],
			priceNet: [p.priceNet, Validators.required || null],
			vatRate: [p.vatRate],
			amountWithVat: [p.amountWithVat || 0],
			amountVat: [p.amountVat || 0],
			amountWithoutVat: [p.amountWithoutVat || 0],
			autoSum: autoSum || true,
			msgEinvoicepmtExtraFieldList: this.formBuilder.array(product ? (product.msgEinvoicepmtExtraFieldList || []).map(field => this.getEinvoicepmtAdditionalFieldsOnProductForm(field)) : []),
		});
		return form;
	}

	public getEinvoicepmtTotalSumsForm(einvoicepmt?: Partial<EinvoicepmtDto>): FormGroup {
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const form = this.formBuilder.group({
			quantity: [e.totalQuantity || null],
			amountVat: [e.totalAmountVat || null],
			amountWithVat: [e.totalAmountWithVat || null],
			amountWithoutVat: [e.totalAmountWithoutVat || null],
			isAutoSum: [e.formSettings && e.formSettings.isAutoSum || true]
		});
		return form;
	}

	public getEinvoicepmtAdditionalFieldsOnProductForm(value?: ExtraFieldForm): FormGroup {
		return this.formBuilder.group({
			dictionary: [value || null],
			fieldName: [value && value.fieldName || null],
			fieldValue: [value && value.fieldValue || null, Validators.required],
			fieldCode: [value && value.fieldCode || null]
		});
	}

	public getForm(einvoicepmt?: EinvoicepmtDto): FormGroup {
		const fb = this.formBuilder;
		const e = einvoicepmt || {} as Partial<EinvoicepmtDto>;
		const fs = e.formSettings || {
			isAutoSum: true,
			isPublicGlnAtShipFrom: false,
			isPublicGlnAtShipTo: false,
			productsPositionWithAutoSum: [],
			additionalFieldsDictionary: []
		};
		return fb.group({
			id: e.id,
			common: this.getEinvoicepmtCommonForm(einvoicepmt),
			supplier: this.getEinvoicepmtSupplierForm(einvoicepmt),
			buyer: this.getEinvoicepmtBuyerForm(einvoicepmt),
			shipper: this.getEinvoicepmtShipperForm(einvoicepmt),
			receiver: this.getEinvoicepmtReceiverForm(einvoicepmt),
			additionalFields: fb.group({
				fields: fb.array((e.extraFieldList || []).map((extraField, index) => this.getEinvoicepmtAdditionalFieldForm(extraField, (fs.additionalFieldsDictionary || [])[index]))),
			}),
			products: fb.group({
				products: fb.array((e.msgEincoicepmtProductList || []).map(product =>
					this.getEinvoicepmtProductForm(product, (fs.productsPositionWithAutoSum || []).some(pp => pp.toString() === product.position))
				)),
				totalSums: this.getEinvoicepmtTotalSumsForm(einvoicepmt)
			}),
		});
	}

	public getEmptyForm$(draftType: DraftType, testIndicator: boolean): Observable<FormGroup> {
		this.store$.dispatch(getEinvoicepmtDraftNumber(draftType));
		const organizationSelector = createSelector(this.userSelectFn, state => state.organizationInfo);
		const einvoicepmtDraftNumber = createSelector(this.einvoicepmtSelectFn, state => state.einvoicepmtDraftNumber);
		return combineLatest(
			this.store$.pipe(select(organizationSelector), notNull()),
			this.store$.pipe(select(einvoicepmtDraftNumber), notNull())
		).pipe(
			take(1),
			map(([org, draftNumber]) => this.getForm({
				testIndicator,
				processingStatus: "0",
				invoicepmtNumber: [org.ewaybillProviderCode, org.gln, draftNumber].filter(e => !!e).join("-"),
				supplier: {
					name: org.name,
					address: org.addressFull,
					gln: org.gln,
					accountNumber: org.accountNumber,
					bankAddress: org.bankAddress,
					bankCode: org.bankCode,
					bankName: org.bankName,
					unp: org.unp
				}
			}))
		);
	}

	public getEditableForm$(draftType: DraftType, draftId: string): Observable<FormGroup> {
		this.store$.dispatch(getEinvoicepmtDocumentDraft(draftType, Number.parseInt(draftId)));
		const selectEincepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectEinvoicepmt = createSelector(selectEincepmtState, (state: EinvoicepmtState): EinvoicepmtDto | undefined => state.einvoicepmt);
		return this.store$.pipe(select(selectEinvoicepmt)).pipe(notNull(), take(1), map(einvoicepmt => this.getForm(einvoicepmt)));
	}

	public getForm$(draftType: DraftType, draftId: string | null, testIndicator: boolean): Observable<FormGroup> {
		return draftId ? this.getEditableForm$(draftType, draftId) : this.getEmptyForm$(draftType, testIndicator);
	}
}
