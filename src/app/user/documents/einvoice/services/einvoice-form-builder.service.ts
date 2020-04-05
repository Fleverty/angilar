import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserState } from "@app/user/user.reducer";
import { Observable, combineLatest } from "rxjs";
import { DraftType } from "@helper/abstraction/draft";
import { Store, createSelector, select } from "@ngrx/store";
import { notNull } from "@helper/operators";
import { map, take } from "rxjs/operators";
import { EinvoiceProduct, EinvoiceDto, SupplierDto, BuyerDto, ShipperDto, ReceiverDto, ShipToDto, ShipFromDto } from "@helper/abstraction/einvoice";
import { ExtraFieldForm } from "../einvoice-extra-information/einvoice-extra-information.component";
import { getEinvoiceDraftNumber } from "../../documents.actions";
import { ValidatorsUtil } from "@helper/validators-util";
import { EinvoiceSelectorService } from "./einvoice-selector.service";
import { getEinvocieDraft } from "../einvoice-actions/einvoice-draft.actions";

@Injectable()
export class EinvoiceFormBuilderService {
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
		private readonly store$: Store<UserState>
	) { }

	public userSelectFn = (appState: any): UserState => appState.user;
	//neads refactor getEmptyForm()
	public getForm$(draftType: DraftType, draftId: string, testIndicator = false): Observable<FormGroup> {
		return draftId ? this.getEditableForm$(draftId) : this.getEmptyForm$(draftType, testIndicator);
	}

	// organizationInfo обязательно должно быть в store иначе сработает guard и заредиректит
	public getEmptyForm$(draftType: DraftType, testIndicator: boolean): Observable<FormGroup> {
		this.store$.dispatch(getEinvoiceDraftNumber(draftType));
		const organizationSelector = createSelector(this.userSelectFn, state => state.organizationInfo);
		return combineLatest(
			this.einvoiceSelectorService.select$(state => state.einvoiceDraftNumber).pipe(notNull()),
			this.store$.pipe(select(organizationSelector), notNull())
		).pipe(
			take(1),
			map(([einvoiceDraftNumber, org]) =>
				this.getForm({
					testIndicator,
					processingStatus: 0,
					documentNumber: einvoiceDraftNumber,  // TODO: should be einvoice specific?
					supplier: {
						accountNumber: org.accountNumber,
						name: org.name,
						id: org.id,
						gln: org.gln,
						unp: org.unp,
						address: org.addressFull,
						bankAddress: org.bankAddress,
						bankCode: org.bankCode,
						bankName: org.bankName
					},
					shipper: {
						address: org.addressFull,
						gln: org.gln,
						id: org.id,
						name: org.name,
						unp: org.unp
					},
					invoiceNumber: `${org.ewaybillProviderCode}-${org.gln}`
				})
			)
		);
	}

	public getEditableForm$(draftId: string): Observable<FormGroup> {
		this.store$.dispatch(getEinvocieDraft(+draftId));
		return this.einvoiceSelectorService.select$(a => a.einvoice).pipe(
			notNull(),
			map(einvoice => this.getForm(einvoice))
		);
	}

	public getForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const fb = this.formBuilder;
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const fs = e.formSettings || {
			isAutoSum: true,
			isPublicGlnAtShipFrom: false,
			isPublicGlnAtShipTo: false,
			productsPositionWithAutoSum: []
		};
		return fb.group({
			id: e.id,
			testIndicator: e.testIndicator,
			supplierData: e.supplierData,
			common: this.getEinvoiceCommonForm(einvoice),
			supplier: this.getSupplierForm(einvoice),
			buyer: this.getBuyerForm(einvoice),
			// shipper: this.getShipperForm(einvoice),
			// consignee: this.getConsigneeForm(einvoice),
			// places: this.getPlacesForm(einvoice, fs.isPublicGlnAtShipFrom, fs.isPublicGlnAtShipTo),
			extras: fb.group({
				documents: fb.array((e.extraFieldList || []).map((extraField: any) => this.getExtraFieldForm(extraField))),
			}),

			products: fb.group({
				products: fb.array((e.einvoiceItemList || []).map(product =>
					this.getProductForm(product, (fs.productsPositionWithAutoSum || []).some((pp: any) => pp === product.position))
				)),
				totalSums: this.getTotalSumsForm(einvoice)
			}),
		});
	}

	public getEinvoiceCommonForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const series: string[] = einvoice && einvoice.invoiceNumber && einvoice.invoiceNumber.split("-") || [];
		const e = einvoice || {} as Partial<EinvoiceDto>;
		return this.formBuilder.group({
			invoiceDate: [e.invoiceDate && new Date(e.invoiceDate) || new Date(), Validators.required],
			processingStatus: this.formBuilder.control({ value: `${e.processingStatus}` || null, disabled: true }),
			seria01: this.formBuilder.control({ value: series[0] || null, disabled: true }), // provider code TODO
			seria02: this.formBuilder.control({ value: series[1] || null, disabled: true }), // shipper GLN
			number: [e.documentNumber || series[2] || null, Validators.required],
			dateCreate: [e.dateCreate && new Date(e.dateCreate) || new Date(), Validators.required],
			contractNumber: [e.contractNumber || null, Validators.required],
			contractDate: [e.contractDate && new Date(e.contractDate) || null, Validators.required],
			purport: [e.purport || null, Validators.required],
			paymentBeginDate: [e.paymentBeginDate && new Date(e.paymentBeginDate) || null, Validators.required],
			paymentEndDate: [e.paymentEndDate && new Date(e.paymentEndDate) || null, Validators.required],
			ordersNumber: [e.orderNumber || null],
			currency: [e.currency || { id: 1, code: "BYN", name: "Белорусский рубль" }, Validators.required],
			deliveryStatus: [e.deliveryStatus],
			deliveryError: [e.deliveryError],
			testIndicator: [e.testIndicator]
		});
	}

	public getSupplierForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const s = e.supplier || {} as Partial<SupplierDto>;
		return this.formBuilder.group({
			supplierId: [s.id || null],
			supplierName: this.formBuilder.control({ value: s.name || null, disabled: true }),
			supplierGln: this.formBuilder.control({ value: s.gln || null, disabled: true }),
			supplierUnp: this.formBuilder.control({ value: s.unp || null, disabled: true }),
			supplierAccountNumber: [s.accountNumber || null, Validators.maxLength(35)],
			supplierAddress: this.formBuilder.control({ value: s.address || null, disabled: true }),
			supplierBankName: [s.bankName || null, Validators.maxLength(140)],
			supplierBankCode: [s.bankCode || null, Validators.maxLength(17)],
			supplierBankAddress: [s.bankAddress || null, Validators.maxLength(140)],
		});
	}

	public getBuyerForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const b = e.buyer || {} as Partial<BuyerDto>;

		return this.formBuilder.group({
			buyerId: [b.id || null],
			buyerName: [b.id ? {
				id: b.id,
				name: b.name,
				gln: b.gln,
				unp: b.unp,
			} : null, Validators.required],
			buyerGln: this.formBuilder.control({ value: b.gln || null, disabled: true }, { validators: [Validators.required, ValidatorsUtil.checkSumGLN()] }),
			buyerUnp: this.formBuilder.control({ value: b.unp || null, disabled: true }, { validators: [Validators.required, Validators.maxLength(70)] }),
			buyerAddress: this.formBuilder.control({ value: b.address || null, disabled: true }, { validators: [Validators.required, Validators.maxLength(140)] }),
			buyerAccountNumber: [b.accountNumber || null, Validators.maxLength(35)],
			buyerBankName: [b.bankName || null, Validators.maxLength(140)],
			buyerBankCode: [b.bankCode || null, Validators.maxLength(17)],
			buyerBankAddress: [b.bankAddress || null, Validators.maxLength(140)],
		});
	}

	public getShipperForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const s = e.shipper || {} as Partial<ShipperDto>;
		return this.formBuilder.group({
			dictionary: [s.id ? {
				id: s.id,
				gln: s.gln || null,
				name: s.name || null,
				unp: s.unp || null,
				addressFull: s.unp || null,
				type: "shipper",
			} : null],
			name: [s.name || null],
			address: [s.address || null],
			gln: [s.gln || null],
			unp: [s.unp || null],
		});
	}

	public getConsigneeForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const r = e.receiver || {} as Partial<ReceiverDto>;
		return this.formBuilder.group({
			dictionary: [r.id ? {
				id: r.id,
				gln: r.gln || null,
				name: r.name || null,
				unp: r.unp || null,
				addressFull: r.address || null,
				type: "receiver",
			} : null],
			name: [r.name || null],
			address: [r.address || null],
			gln: [r.gln || null],
			unp: [r.unp || null],
		});
	}

	public getPlacesForm(einvoice?: Partial<EinvoiceDto>, isPublicGlnAtShipFrom = false, isPublicGlnAtShipTo = false): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const sf = e.shipFrom || {} as Partial<ShipFromDto>;
		const st = e.shipTo || {} as Partial<ShipToDto>;
		return this.formBuilder.group({
			loading: this.formBuilder.group({
				address: this.formBuilder.control({ value: sf.address || null, disabled: true }, Validators.required),
				gln: this.formBuilder.control({ value: sf.gln || null, disabled: true }, Validators.required),
				isPublicGln: [isPublicGlnAtShipFrom],
				loadingPoint: this.formBuilder.control({ value: sf.id ? { id: sf.id, address: sf.address } : null, disabled: isPublicGlnAtShipFrom }),
				publicGln: this.formBuilder.control({ value: sf.gln || null, disabled: !isPublicGlnAtShipFrom }),
			}),
			unloading: this.formBuilder.group({
				address: this.formBuilder.control({ value: st.address || null, disabled: true }, Validators.required),
				gln: this.formBuilder.control({ value: st.gln || null, disabled: true }, Validators.required),
				unloadingPoint: this.formBuilder.control({ value: st.id ? { id: st.id, address: st.address } : null, disabled: isPublicGlnAtShipTo }),
				isPublicGln: [isPublicGlnAtShipTo],
				publicGln: this.formBuilder.control({ value: st.gln || null, disabled: !isPublicGlnAtShipTo }),
			})
		});
	}

	public getExtraFieldForm(value?: ExtraFieldForm): FormGroup {
		return this.formBuilder.group({
			dictionary: [value || null],
			fieldName: [value && value.fieldName, Validators.required],
			fieldValue: [value && value.fieldValue, Validators.required],
			fieldCode: [value && value.fieldCode]
		});
	}

	public getProductForm(product?: EinvoiceProduct, autoSum?: boolean): FormGroup {
		const p = product || {} as Partial<EinvoiceProduct> & { autoSum?: boolean };
		const form = this.formBuilder.group({
			position: this.formBuilder.control({ value: p.position || null, disabled: true }, Validators.maxLength(35)),
			gtin: [p.gtin || null, [Validators.maxLength(14), ValidatorsUtil.checkSumGTIN()]],
			codeByBuyer: [p.codeByBuyer || null, Validators.maxLength(35)],
			codeBySupplier: [p.codeBySupplier || null, Validators.maxLength(35)],
			fullName: [p.fullName || null, Validators.required],
			uom: [p.uom, Validators.required || null],
			quantity: [p.quantity || null, Validators.required],
			priceNet: [p.priceNet || null, Validators.required],
			country: [p.country || null],
			vatRate: [p.vatRate || null],
			amountExcise: [p.amountExcise || null],
			addInfo: [p.addInfo || null],
			einvoiceItemExtraFieldList: this.formBuilder.array(product && product.einvoiceItemExtraFieldList ? product.einvoiceItemExtraFieldList.map(field => this.getAdditionalFieldsOnProductForm(field)) : []),
			amountVat: [p.amountVat || 0],
			amountWithVat: [p.amountWithVat || 0],
			amountWithoutVat: [p.amountWithoutVat || 0],
			autoSum: autoSum || true,
		});
		return form;
	}

	public getTotalSumsForm(einvoice?: Partial<EinvoiceDto>): FormGroup {
		const e = einvoice || {} as Partial<EinvoiceDto>;
		const form = this.formBuilder.group({
			quantity: [e.totalQuantity || null],
			amountVat: [e.totalAmountVat || null],
			amountExcise: [e.totalAmountExcise || null],
			amountWithVat: [e.totalAmountWithVat || null],
			amountWithoutVat: [e.totalAmountWithoutVat || null],
			isAutoSum: [e.formSettings && e.formSettings.isAutoSum || true]
		});
		return form;
	}

	public getAdditionalFieldsOnProductForm(value?: ExtraFieldForm): FormGroup {
		return this.formBuilder.group({
			dictionary: [value || null],
			fieldName: [value && value.fieldName || null, Validators.required],
			fieldValue: [value && value.fieldValue || null, Validators.required],
			fieldCode: [value && value.fieldCode || null, Validators.required]
		});
	}
}
