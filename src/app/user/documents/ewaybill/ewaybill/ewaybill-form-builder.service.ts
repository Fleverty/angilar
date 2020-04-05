import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { notNull } from "@helper/operators";
import { take, map } from "rxjs/operators";
import { UserState } from "@app/user/user.reducer";
import { Store, select, createSelector } from "@ngrx/store";
import { Observable, combineLatest } from "rxjs";
import { DraftType } from "@helper/abstraction/draft";
import { getEwaybill } from "../ewaybill.actions";
import { getDraftNumber } from "../../documents.actions";
import { ExtraFieldForm } from "../ewaybill-extra-information/ewaybill-extra-information.component";
import { EwaybillAttachedDocumentsForm } from "../ewaybill-attached-documents/ewaybill-attached-documents.component";
import { EwaybillProduct, Ewaybill, ProductDocumentInformation } from "@helper/abstraction/ewaybill";
import { MessageType } from "@helper/abstraction/documents";
import { ValidatorsUtil } from "@helper/validators-util";

@Injectable()
export class EwaybillFormBuilderService {
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly store$: Store<UserState>
	) { }

	public userSelectFn = (appState: any): UserState => appState.user;

	public getForm$(draftType: DraftType, draftId: string, testIndicator = false): Observable<FormGroup> {
		return draftId ? this.getEditableForm$(draftType, draftId) : this.getEmptyForm$(draftType, testIndicator);
	}

	// organizationInfo обязательно должно быть в store иначе сработает guard и заредиректит
	public getEmptyForm$(draftType: DraftType, testIndicator: boolean): Observable<FormGroup> {
		this.store$.dispatch(getDraftNumber(draftType));
		const organizationSelector = createSelector(this.userSelectFn, state => state.organizationInfo);
		return combineLatest(
			this.ewaybillSelectorService.select$(state => state.ewaybillDraftNumber).pipe(notNull()),
			this.store$.pipe(select(organizationSelector), notNull())
		).pipe(
			take(1),
			map(([ewaybillDraftNumber, org]) =>
				this.getForm({
					testIndicator,
					processingStatus: "0",
					deliveryNoteNumber: `${org.ewaybillProviderCode}-${org.gln}`,
					shipperId: org.id,
					shipperName: org.name,
					shipperAddress: org.addressFull,
					shipperGln: org.gln,
					shipperUnp: org.unp,
					number: ewaybillDraftNumber,
					msgType: draftType,
					msgEwaybillProductList: [],
				})
			)
		);
	}

	public getEditableForm$(draftType: DraftType, draftId: string): Observable<FormGroup> {
		this.store$.dispatch(getEwaybill(draftType, draftId));
		return this.ewaybillSelectorService.select$(a => a.ewaybill).pipe(
			notNull(),
			map(ewaybill => this.getForm(ewaybill))
		);
	}

	public getForm(ewaybill?: Ewaybill): FormGroup {
		const fb = this.formBuilder;
		const e = ewaybill || {} as Partial<Ewaybill>;
		const fs = e.formSettings || {
			isAutoSum: true,
			isPublicGlnAtShipFrom: false,
			isPublicGlnAtShipTo: false,
			productsPositionWithAutoSum: []
		};
		return fb.group({
			id: e.id,
			testIndicator: e.testIndicator,
			common: this.getEwaybillCommonForm(ewaybill),
			shipper: this.getShipperForm(ewaybill),
			сonsignee: this.getConsigneeForm(ewaybill),
			customer: this.getCustomerForm(ewaybill),
			places: this.getPlacesForm(ewaybill, fs.isPublicGlnAtShipFrom, fs.isPublicGlnAtShipTo),
			details: this.getDetailsForm(ewaybill),
			attached: fb.group({
				documents: fb.array((e.msgEwaybillDocList || []).map(document => this.getDocumentForm(document))),
			}),
			extras: fb.group({
				documents: fb.array((e.msgEwaybillExtraFieldList || []).map(extraField => this.getExtraFieldForm(extraField))),
			}),
			products: fb.group({
				products: fb.array((e.msgEwaybillProductList || []).map(product =>
					this.getProductForm(e.msgType, product, (fs.productsPositionWithAutoSum || []).some(pp => pp === product.position))
				)),
				totalSums: this.getTotalSumsForm(ewaybill)
			}),
		});
	}

	public getProductForm(type?: MessageType, product?: EwaybillProduct, autoSum?: boolean): FormGroup {
		const p = product || {} as Partial<EwaybillProduct> & { autoSum?: boolean };
		const form = this.formBuilder.group({
			position: this.formBuilder.control({ value: p.position, disabled: true }),
			gtin: [p.gtin || null, [Validators.maxLength(14), ValidatorsUtil.checkSumGTIN()]],
			codeByBuyer: [p.codeByBuyer || null, Validators.maxLength(35)],
			codeBySupplier: [p.codeBySupplier || null, Validators.maxLength(35)],
			fullName: [p.fullName, Validators.required || null],
			uom: [p.uom, Validators.required || null],
			quantityDespatch: [p.quantityDespatch, Validators.required || null],
			priceNet: [p.priceNet, Validators.required || null],
			priceManufacturer: [p.priceManufacturer || null],
			discountBulkRate: [p.discountBulkRate || null],
			discountRate: [p.discountRate || null],
			vatRate: [p.vatRate || null],
			amountExcise: [p.amountExcise || null],
			quantityDespatchLu: [p.quantityDespatchLu || null],
			countryOfOrigin: [p.countryOfOrigin || null],
			expireDate: [p.expireDate && new Date(p.expireDate) || null],
			addInfo: [p.addInfo || null],
			msgEwaybillItemCertList: this.formBuilder.array(product ? product.msgEwaybillItemCertList.map(cert => this.getDocumentInformationOnProductForm(cert)) : []),
			msgEwaybillExtraFieldList: this.formBuilder.array(product ? product.msgEwaybillExtraFieldList.map(field => this.getAdditionalFieldsOnProductForm(field)) : []),
			amountVat: [p.amountVat || 0],
			amountWithVat: [p.amountWithVat || 0],
			amountWithoutVat: [p.amountWithoutVat || 0],
			autoSum: autoSum || true,
		});
		if (type === "BLRWBL" || type === "BLRWBR")
			form.addControl("grossWeight", this.formBuilder.control(p.grossWeight || null, Validators.required));
		return form;
	}

	public getEwaybillCommonForm(ewaybill?: Ewaybill): FormGroup {
		const series: string[] = ewaybill && ewaybill.deliveryNoteNumber.split("-") || [];
		const e = ewaybill || {} as Partial<Ewaybill>;
		return this.formBuilder.group({
			processingStatus: [`${e.processingStatus}` || null],
			seria01: [series[0] || null], // provider code TODO
			seria02: [series[1] || null], // shiper GLN
			number: [e.number || series[2] || null, Validators.required],
			deliveryNoteDate: [e.deliveryNoteDate && new Date(e.deliveryNoteDate) || new Date(), Validators.required],
			contractName: [e.contractName || null],
			contractNumber: [e.contractNumber || null, Validators.required],
			contractDate: [e.contractDate && new Date(e.contractDate) || null],
			ordersNumber: [e.ordersNumber || null],
			currency: [e.currency || { id: 1, code: "BYN", name: "Белорусский рубль" }, Validators.required],
			deliveryStatus: [e.deliveryStatus],
			deliveryError: [e.deliveryError]
		});
	}

	public getShipperForm(ewaybill?: Ewaybill): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		return this.formBuilder.group({
			dictionary: [e.shipperId ? {
				id: e.shipperId,
				gln: e.shipperGln || null,
				name: e.shipperName || null,
				unp: e.shipperUnp || null,
				addressFull: e.shipperAddress || null,
				type: "shipper",
			} : null],
			name: [e.shipperName || null],
			address: [e.shipperAddress || null, Validators.required],
			gln: [e.shipperGln || null],
			unp: [e.shipperUnp, Validators.required],
		});
	}

	public getConsigneeForm(ewaybill?: Ewaybill): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		return this.formBuilder.group({
			dictionary: [e.receiverId ? {
				id: e.receiverId,
				gln: e.receiverGln || null,
				name: e.receiverName || null,
				unp: e.receiverUnp || null,
				addressFull: e.receiverAddress || null,
				type: "receiver",
			} : null, Validators.required],
			name: [e.receiverName || null],
			address: [e.receiverAddress || null, Validators.required],
			gln: [e.receiverGln || null],
			unp: [e.receiverUnp, Validators.required],
		});
	}

	public appendCustomerForm(form: FormGroup): void {
		form.addControl("dictionary", this.formBuilder.control(null));
		form.addControl("name", this.formBuilder.control(null));
		form.addControl("address", this.formBuilder.control(null, { validators: Validators.required }));
		form.addControl("gln", this.formBuilder.control(null, { validators: [ValidatorsUtil.checkSumGLN()] }));
		form.addControl("unp", this.formBuilder.control(null, { validators: Validators.required }));
	}

	public removeCustomerForm(form: FormGroup): void {
		form.removeControl("dictionary");
		form.removeControl("name");
		form.removeControl("address");
		form.removeControl("gln");
		form.removeControl("unp");
	}

	public getCustomerForm(ewaybill?: Ewaybill): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		if (e.freightPayerAddress || e.freightPayerUnp || e.freightPayerGln || e.freightPayerName)
			return this.formBuilder.group({
				dictionary: [e.freightPayerId ? {
					id: e.freightPayerId,
					gln: e.freightPayerGln || null,
					name: e.freightPayerName || null,
					unp: e.freightPayerUnp || null,
					addressFull: e.freightPayerAddress || null,
					type: "freightPayer",
				} : null],
				name: [e.freightPayerName || null],
				address: [e.freightPayerAddress || null, Validators.required],
				gln: [e.freightPayerGln || null, [ValidatorsUtil.checkSumGLN()]],
				unp: [e.freightPayerUnp || null, Validators.required],
			});
		return this.formBuilder.group({});
	}

	public getDetailsForm(ewaybill?: Ewaybill): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		const form = this.formBuilder.group({
			baseShippingDocumentDate: [e.baseShippingDocumentDate && new Date(e.baseShippingDocumentDate) || null],
			baseShippingDocumentName: [e.baseShippingDocumentName || null],
			baseShippingDocumentNumber: [e.baseShippingDocumentNumber || null],
			deliveryContact: [e.deliveryContact || null, Validators.required],
			partyIssuingProxyName: [e.partyIssuingProxyName || null],
			proxyDate: [e.proxyDate && new Date(e.proxyDate) || null],
			proxyNumber: [e.proxyNumber || null],
			quantityTrip: [e.quantityTrip || null],
			shipFromContact: [e.shipFrom && e.shipFrom.contact || null, Validators.required],
			shipperContact: [e.shipperContact || null, Validators.required],
			shipperSealNumber: [e.shipperSealNumber || null],
			trailerNumber: [e.trailerNumber || null],
		});
		if (e.msgType === "BLRWBL" || e.msgType === "BLRWBR") {
			form.addControl("transportContact", this.formBuilder.control(e.transportContact || null, Validators.required));
			form.addControl("transportNumber", this.formBuilder.control(e.transportNumber || null, Validators.required));
			form.addControl("transportOwnerName", this.formBuilder.control(e.transportOwnerName || null));
			form.addControl("waybillNumber", this.formBuilder.control(e.waybillNumber || null, Validators.required));
		}
		return form;
	}

	public getPlacesForm(ewaybill?: Ewaybill, isPublicGlnAtShipFrom = false, isPublicGlnAtShipTo = false): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		const sf = e.shipFrom || {};
		const st = e.shipTo || {};
		return this.formBuilder.group({
			loading: this.formBuilder.group({
				address: [sf.address || null, Validators.required],
				gln: [sf.gln || null, Validators.required],
				isPublicGln: [isPublicGlnAtShipFrom],
				loadingPoint: this.formBuilder.control({ value: !isPublicGlnAtShipFrom ? { address: sf.address } : null, disabled: isPublicGlnAtShipFrom }),
				publicGln: this.formBuilder.control({ value: isPublicGlnAtShipFrom ? { address: sf.address, gln: sf.gln } : null, disabled: !isPublicGlnAtShipFrom }),
			}),
			unloading: this.formBuilder.group({
				address: [st.address || null, Validators.required],
				unloadingPoint: this.formBuilder.control({ value: !isPublicGlnAtShipTo ? { address: st.address } : null, disabled: isPublicGlnAtShipTo }),
				gln: [st.gln || null, Validators.required],
				isPublicGln: [isPublicGlnAtShipTo],
				publicGln: this.formBuilder.control({ value: isPublicGlnAtShipTo ? { address: st.address, gln: st.gln } : null, disabled: !isPublicGlnAtShipTo }),
			})
		});
	}

	public getTotalSumsForm(ewaybill?: Ewaybill): FormGroup {
		const e = ewaybill || {} as Partial<Ewaybill>;
		const form = this.formBuilder.group({
			quantityDespatch: [e.totalQuantity || null],
			amountVat: [e.totalAmountVat || null],
			amountExcise: [e.totalAmountExcise || null],
			amountWithVat: [e.totalAmountWithVat || null],
			amountWithoutVat: [e.totalAmountWithoutVat || null],
			quantityDespatchLu: [e.totalQuantityLu || null],
			isAutoSum: [e.formSettings && e.formSettings.isAutoSum || true]
		});
		if (e.msgType === "BLRWBL" || e.msgType === "BLRWBR")
			form.addControl("grossWeight", this.formBuilder.control(e.totalGrossWeight || 0));
		return form;
	}

	public getDocumentForm(value?: EwaybillAttachedDocumentsForm): FormGroup {
		return this.formBuilder.group({
			documentDate: [value && value.documentDate && new Date(value.documentDate), Validators.required],
			documentNumber: [value && value.documentNumber, Validators.required],
			documentName: [value && value.documentName, Validators.required],
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

	public getDocumentInformationOnProductForm(value?: ProductDocumentInformation): FormGroup {
		return this.formBuilder.group({
			certType: [value && value.certType || null, Validators.required],
			certNumber: [value && value.certNumber || null, Validators.required],
			dateFrom: [value && value.dateFrom && new Date(value.dateFrom) || null],
			dateTo: [value && value.dateTo && new Date(value.dateTo) || null],
			certPartyIssuingName: [value && value.certPartyIssuingName || null],
		});
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
