import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
	ShipmentNotification,
	ShipmentNotificationProduct
} from "@helper/abstraction/shipment-notification";
import { Injectable } from "@angular/core";
import { ValidatorsUtil } from "@helper/validators-util";
import { ShipmentNotificationSelectorService } from "./shipment-notification-selector.service";
import { UserState } from "@app/user/user.reducer";
import { Store, createSelector, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { getShipmentNotificationDraft } from "./shipment-notification.actions";
import { notNull } from "@helper/operators";
import { map, take } from "rxjs/operators";

@Injectable()
export class ShipmentNotificationFormBuilderService {
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly shipmentNotificationSelectorService: ShipmentNotificationSelectorService,
		private readonly store: Store<UserState>
	) { }

	public userSelectFn = (appState: any): UserState => appState.user;

	public getForm$(draftId?: string): Observable<FormGroup> {
		return draftId ? this.getEditableForm$(draftId) : this.getEmptyForm$();
	}

	public getEmptyForm$(): Observable<FormGroup> {
		const organizationSelector = createSelector(this.userSelectFn, state => state.organizationInfo);
		return this.store.pipe(
			select(organizationSelector),
			notNull(),
			take(1),
			map(value => this.getForm({
				supplierName: value.name,
				supplierGln: value.gln,
				supplierUnp: value.unp
			}
			))
		);
	}

	public getEditableForm$(draftId: string): Observable<FormGroup> {
		this.store.dispatch(getShipmentNotificationDraft("DESADV", draftId));
		return this.shipmentNotificationSelectorService.select$(a => a.shipmentNotification).pipe(
			notNull(),
			take(1),
			map(shipmentNotification => this.getForm(shipmentNotification))
		);
	}

	public getForm(shipmentNotification?: ShipmentNotification): FormGroup {
		const sn = shipmentNotification || {} as Partial<ShipmentNotification>;

		return this.formBuilder.group({
			id: shipmentNotification && shipmentNotification.id,
			common: this.getShipmentNotificationsCommonForm(shipmentNotification),
			buyer: this.getShipmentNotificationsBuyerForm(shipmentNotification),
			supplier: this.getShipmentNotificationsSupplierForm(shipmentNotification),
			shipmentPlace: this.getShipmentNotificationsShipmentPlaceForm(shipmentNotification),
			deliveryPlace: this.getShipmentNotificationsDeliveryPlaceForm(shipmentNotification),
			transportationCustomer: this.getShipmentNotificationsTransportationCustomerForm(shipmentNotification),
			finalRecipient: this.getShipmentNotificationsFinalRecipientForm(shipmentNotification),
			transportDetails: this.getShipmentNotificationsTransportDetailsForm(shipmentNotification),
			detailsResponsiblePersons: this.getShipmentNotificationsDetailsResponsiblePersonsForm(shipmentNotification),
			products: this.formBuilder.group({
				products: this.formBuilder.array((sn.msgDesadvItems || []).map(product =>
					this.getShipmentNotificationsProductForm(product)
				)),
				totalSums: this.getShipmentNotificationsTotalSumsForm(shipmentNotification)
			}),
		});
	}

	public getShipmentNotificationsCommonForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			documentNumber: this.formBuilder.control(shipmentNotification && shipmentNotification.documentNumber || null),
			documentDate: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.documentDate && new Date(shipmentNotification.documentDate) || new Date(), disabled: true }, { validators: Validators.required }),
			deliveryNoteNumber: [shipmentNotification && shipmentNotification.deliveryNoteNumber, Validators.required],
			deliveryNoteDate: shipmentNotification && shipmentNotification.deliveryNoteDate && new Date(shipmentNotification.deliveryNoteDate),
			ultimateDeliveryNoteNumber: shipmentNotification && shipmentNotification.ultimateDeliveryNoteNumber,
			orderNumber: shipmentNotification && shipmentNotification.orderNumber,
			orderDate: shipmentNotification && shipmentNotification.orderDate && new Date(shipmentNotification.orderDate),
			deliveryDate: shipmentNotification && shipmentNotification.deliveryDate && new Date(shipmentNotification.deliveryDate),
			contractNumber: shipmentNotification && shipmentNotification.contractNumber,
			contractDate: shipmentNotification && shipmentNotification.contractDate && new Date(shipmentNotification.contractDate),
			deliveryError: shipmentNotification && shipmentNotification.deliveryError,
			deliveryStatus: shipmentNotification && shipmentNotification.deliveryStatus
		});
	}

	public getShipmentNotificationsBuyerForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			buyerId: [shipmentNotification && shipmentNotification.buyerId],
			buyerName: [shipmentNotification && shipmentNotification.buyerName || null, Validators.required],
			buyerGln: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.buyerGln || null, disabled: true }, { validators: Validators.required }),
			buyerUnp: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.buyerUnp || null, disabled: true }, { validators: Validators.required })
		});
	}

	public getShipmentNotificationsSupplierForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			supplierName: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.supplierName || null, disabled: true }),
			supplierGln: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.supplierGln || null, disabled: true }),
			supplierUnp: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.supplierUnp || null, disabled: true })
		});
	}

	public getShipmentNotificationsShipmentPlaceForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			dictionary: [shipmentNotification && {
				addressFull: shipmentNotification.shipFromPointAddress,
				storageName: shipmentNotification.shipFromPointName
			}],
			shipFromPointId: shipmentNotification && shipmentNotification.shipFromPointId,
			shipFromPointAddress: shipmentNotification && shipmentNotification.shipFromPointAddress,
			shipFromPointName: shipmentNotification && shipmentNotification.shipFromPointName,
			shipFromPointGln: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.shipFromPointGln || null, disabled: true })
		});
	}

	public getShipmentNotificationsDeliveryPlaceForm(shipmentNotification?: ShipmentNotification): FormGroup {
		const deliveryPlace = shipmentNotification && (shipmentNotification.deliveryPointAddress || shipmentNotification.deliveryPointName) ? {
			addressFull: shipmentNotification.deliveryPointAddress,
			storageName: shipmentNotification.deliveryPointName
		} : null;
		return this.formBuilder.group({
			dictionary: [deliveryPlace, Validators.required],
			deliveryPointId: [shipmentNotification && shipmentNotification.deliveryPointId || null],
			deliveryPointAddress: [shipmentNotification && shipmentNotification.deliveryPointAddress || null],
			deliveryPointName: [shipmentNotification && shipmentNotification.deliveryPointName || null],
			deliveryPointGln: this.formBuilder.control({ value: shipmentNotification && shipmentNotification.deliveryPointGln || null, disabled: true }, { validators: Validators.required })
		});
	}

	public getShipmentNotificationsTransportationCustomerForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			freightPayerName: shipmentNotification && shipmentNotification.freightPayerName,
			freightPayerGln: [shipmentNotification && shipmentNotification.freightPayerGln, [ValidatorsUtil.checkSumGTIN(), Validators.maxLength(13), Validators.minLength(13), Validators.pattern("^[0-9]*$")]],
			freightPayerUnp: [shipmentNotification && shipmentNotification.freightPayerUnp, Validators.pattern("^[0-9]*$")]
		});
	}

	public getShipmentNotificationsFinalRecipientForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			ultimateRecipientAddress: shipmentNotification && shipmentNotification.ultimateRecipientAddress,
			ultimateRecipientGln: [shipmentNotification && shipmentNotification.ultimateRecipientGln, [ValidatorsUtil.checkSumGTIN(), Validators.maxLength(13), Validators.minLength(13), Validators.pattern("^[0-9]*$")]]
		});
	}

	public getShipmentNotificationsTransportDetailsForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			transportNumber: shipmentNotification && shipmentNotification.transportNumber,
			trailerNumber: shipmentNotification && shipmentNotification.trailerNumber,
			waybillNumber: shipmentNotification && shipmentNotification.waybillNumber,
			transportOwnerName: shipmentNotification && shipmentNotification.transportOwnerName,
			transportContact: shipmentNotification && shipmentNotification.transportContact,
			quantityTrip: shipmentNotification && shipmentNotification.quantityTrip
		});
	}

	public getShipmentNotificationsDetailsResponsiblePersonsForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			shipperContact: shipmentNotification && shipmentNotification.shipperContact,
			shipFromContact: shipmentNotification && shipmentNotification.shipFromContact,
			deliveryContact: shipmentNotification && shipmentNotification.deliveryContact,
			proxy: this.formBuilder.group({
				proxyNumber: shipmentNotification && shipmentNotification.proxyNumber,
				proxyDate: shipmentNotification && shipmentNotification.proxyDate && new Date(shipmentNotification.proxyDate),
				partyIssuingProxyName: shipmentNotification && shipmentNotification.partyIssuingProxyName
			})
		});
	}

	public getShipmentNotificationsProductForm(shipmentNotificationProduct?: ShipmentNotificationProduct): FormGroup {
		return this.formBuilder.group({
			position: this.formBuilder.control({ value: shipmentNotificationProduct && shipmentNotificationProduct.position, disabled: true }),
			gtin: [shipmentNotificationProduct && shipmentNotificationProduct.gtin, [Validators.maxLength(14), ValidatorsUtil.checkSumGTIN()]],
			codeByBuyer: [shipmentNotificationProduct && shipmentNotificationProduct.codeByBuyer, Validators.maxLength(35)],
			codeBySupplier: [shipmentNotificationProduct && shipmentNotificationProduct.codeBySupplier, Validators.maxLength(35)],
			fullName: [shipmentNotificationProduct && shipmentNotificationProduct.fullName],
			uom: [shipmentNotificationProduct && shipmentNotificationProduct.uom],
			quantityOrdered: [shipmentNotificationProduct && shipmentNotificationProduct.quantityOrdered],
			quantityDespatch: [shipmentNotificationProduct && shipmentNotificationProduct.quantityDespatch, Validators.required],
			quantityDespatchLu: [shipmentNotificationProduct && shipmentNotificationProduct.quantityDespatchLu],
			quantityOrderedLu: [shipmentNotificationProduct && shipmentNotificationProduct.quantityOrderedLu],
			manufacturerName: [shipmentNotificationProduct && shipmentNotificationProduct.manufacturerName],
			countryOfOrigin: [shipmentNotificationProduct && shipmentNotificationProduct.countryOfOrigin],
			productionDate: [shipmentNotificationProduct && shipmentNotificationProduct.productionDate && new Date(shipmentNotificationProduct.productionDate)],
			expireDate: [shipmentNotificationProduct && shipmentNotificationProduct.expireDate && new Date(shipmentNotificationProduct.expireDate)],
			priceManufacturer: [shipmentNotificationProduct && shipmentNotificationProduct.priceManufacturer],
			priceNet: [shipmentNotificationProduct && shipmentNotificationProduct.priceNet],
			vatRate: [shipmentNotificationProduct && shipmentNotificationProduct.vatRate],
			grossWeight: [shipmentNotificationProduct && shipmentNotificationProduct.grossWeight],
			addInfo: [shipmentNotificationProduct && shipmentNotificationProduct.addInfo, Validators.maxLength(512)],
			type: [shipmentNotificationProduct && shipmentNotificationProduct.type],
			batchNumber: [shipmentNotificationProduct && shipmentNotificationProduct.batchNumber],
			customDeclarationNumber: [shipmentNotificationProduct && shipmentNotificationProduct.customDeclarationNumber],
			certificateNumber: [shipmentNotificationProduct && shipmentNotificationProduct.certificateNumber],
			amountWithoutVat: [shipmentNotificationProduct && shipmentNotificationProduct.amountWithoutVat],
			amountVat: [shipmentNotificationProduct && shipmentNotificationProduct.amountVat],
			amountWithVat: [shipmentNotificationProduct && shipmentNotificationProduct.amountWithVat],
			ultimateAmountWithoutVat: [shipmentNotificationProduct && shipmentNotificationProduct.ultimateAmountWithoutVat],
			ultimateAmountVat: [shipmentNotificationProduct && shipmentNotificationProduct.ultimateAmountVat],
			autoSum: [shipmentNotificationProduct && shipmentNotificationProduct.autoSum !== undefined ? shipmentNotificationProduct.autoSum : true]
		});
	}

	public getShipmentNotificationsTotalSumsForm(shipmentNotification?: ShipmentNotification): FormGroup {
		return this.formBuilder.group({
			quantityDespatch: [shipmentNotification && shipmentNotification.totalQuantity],
			quantityDespatchLu: [shipmentNotification && shipmentNotification.totalQuantityLu],
			grossWeight: [shipmentNotification && shipmentNotification.totalGrossWeight],
			amountWithoutVat: [shipmentNotification && shipmentNotification.totalAmountWithoutVat],
			amountVat: [shipmentNotification && shipmentNotification.totalAmountVat],
			amountWithVat: [shipmentNotification && shipmentNotification.totalAmountWithVat],
			isAutoSum: [shipmentNotification && shipmentNotification.isAutoSum || true]
		});
	}
}
