import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createSelector, select, Store } from "@ngrx/store";
import { UserState } from "@app/user/user.reducer";
import { Observable } from "rxjs";
import {
	combineLatest,
	filter,
	map,
	shareReplay,
	take
} from "rxjs/operators";
import { notNull } from "@helper/operators";
import { ValidatorsUtil } from "@helper/validators-util";
import { OrderParams, OrderProduct, OrderKind, OrderProductParams, OrderResponseParams } from "@helper/abstraction/order";
import { OrdersState } from "@app/user/documents/order/orders.reducer";
import { DraftType } from "@helper/abstraction/draft";
import * as OrderActions from "../order.actions";
import { Currency } from "@helper/abstraction/currency";
import { getOrdersResponseDraft } from "../order.actions";
import { UserProfile } from "@helper/abstraction/user";
import { Organization } from "@helper/abstraction/organization";
import { MessageType } from "@helper/abstraction/documents";
import { OrdersSelectorService } from "../order-selector.service";

export interface OrderResponseForm {
	responseDate: Date;
	orderComment: string;
	product: {
		products: OrderProduct[];
		totalQuantity: string;
		totalQuantityLu: string;
		totalAmountWithoutVat: string;
		totalAmountVat: string;
		totalAmountWithVat: string;
		autoSum: boolean;
	};
}
export interface OrderForm {
	draftType: DraftType;
	draftId: string;
	id: string;
	ordersNumber: string;
	ordersId: number;
	msgSenderGln: string;
	msgReceiverGln: string;
	common: {
		id: string | null;
		errorText: null;
		processingStatusId: number | null;
		deleveryStatusId: number | null;
		orderNumber: number | null;
		senderOrderNumber: number | null;
		orderDate: Date;
		orderKindId: "220";
		contractNumber: string | null;
		deliveryDate: Date | null;
		shipmentDate: Date | null;
		currency: Currency | null;
		orderAuthor: string | null;
		orderAuthorEmail: string | null;
		orderAuthorPhone: string | null;
		replacedOrderNumber: number | null;
		orderContactName: string | null;
		orderContactEmail: string | null;
		orderContactPhone: string | null;
		originalOrdersId: number | null;
		msgDate: string | null;
		msgNumber: string | null;
		responseDate: Date | null;
	};
	buyer: {
		buyerId: number;
		buyerName: string;
		buyerGln: string;
	};
	supplier: {
		supplierId: number;
		supplierName: string;
		supplierGln: string;
	};
	supplyPoint: {
		deliveryPointGln: string;
		deliveryPointAddress: string;
		deliveryPointId: number;
		deliveryPointName: string;
	};
	finalRecipient: {
		ultimateRecipientGln: string | null;
		ultimateRecipientAddress: string | null;
	};
	comment: {
		commentText: string | null;
		orderComment: string | null;
	};
	product: {
		products: OrderProduct[];
		totalQuantity: string;
		totalQuantityLu: string;
		totalAmountWithoutVat: string;
		totalAmountVat: string;
		totalAmountWithVat: string;
		autoSum: boolean;
	};
}

export interface UserAndOrganizationInfo {
	userProfile?: UserProfile;
	organizationInfo?: Partial<Organization>;
	orderKind?: OrderKind;
}

@Injectable()
export class OrderFormBuilderService {
	constructor(
		private readonly store: Store<UserState>,
		private readonly formBuilder: FormBuilder,
		private readonly ordersSelectorService: OrdersSelectorService
	) {
	}

	public userSelectFn = (appState: any): UserState => appState.user;

	public getForm$(draftType: DraftType, draftId: string): Observable<FormGroup> {
		return draftId ? this.getFilledForm$(draftType, draftId) : this.getEmptyForm$();
	}

	public getResponseForm$(draftType: DraftType, draftId: number): Observable<FormGroup> {
		this.store.dispatch(getOrdersResponseDraft(draftType, draftId));
		return this.ordersSelectorService.select$(state => state.order).pipe(
			notNull(),
			take(1),
			map((order: OrderResponseParams) => this.formBuilder.group({
				responseDate: [order.ordrspDeliveryDate && new Date(order.ordrspDeliveryDate) || new Date(), Validators.required],
				orderComment: [order.ordrspComment],
				product: this.formBuilder.group({
					products: this.formBuilder.array((order.msgOrdrspItems || []).map((e, index) => this.getOrderProductFrom(e, order.formSettings && order.formSettings.items[index], "ORDRSP"))),
					totalQuantity: [order.totalQuantity],
					totalQuantityLu: [order.totalQuantityLu],
					totalAmountWithoutVat: [order.totalAmountWithoutVat],
					totalAmountVat: [order.totalAmountVat],
					totalAmountWithVat: [order.totalAmountWithVat],
					autoSum: [order.formSettings && order.formSettings.autoSum]
				}),
			}))
		);
	}

	public getEmptyForm$(): Observable<FormGroup> {
		const selector = createSelector(this.userSelectFn, (appState: any): OrdersState => appState.orders, (a: UserState, b: OrdersState): UserAndOrganizationInfo => ({
			userProfile: a.userProfile,
			organizationInfo: a.organizationInfo,
			orderKind: b.kind
		}));
		const fb = this.formBuilder;
		return this.store.pipe(
			select(selector),
			shareReplay(1),
			filter(up => !!up.userProfile && !!up.organizationInfo),
			take(1),
			map((/*[*/up/*, orderState]*/) => {
				return fb.group({
					common: this.getOrderCommonForm(up),
					buyer: this.getOrderBuyerForm(up),
					supplier: this.getOrderSupplierForm(),
					supplyPoint: this.getOrderSupplyPointForm(),
					finalRecipient: this.getFinalRecipientForm(),
					comment: this.getCommentForm(),
					product: fb.group({
						products: fb.array([]),
						totalLine: [null],
						totalQuantity: [null],
						totalQuantityLu: [null],
						totalAmountWithoutVat: [null],
						totalAmountVat: [null],
						totalAmountWithVat: [null],
						autoSum: true
					})
				});
			}
			)
		);
	}

	public getFilledForm$(draftType: DraftType, draftId: string): Observable<FormGroup> {
		this.store.dispatch(OrderActions.getOrderDraft(draftType, draftId));
		const selectUserState = createSelector(this.userSelectFn, (state: UserState): UserAndOrganizationInfo => ({ userProfile: state.userProfile, organizationInfo: state.organizationInfo }));
		return this.ordersSelectorService.select$(state => state.order).pipe(
			notNull(),
			combineLatest(this.store.select(selectUserState)),
			filter(e => !!e[1] && !!e[1].organizationInfo && !!e[1].userProfile),
			take(1),
			map(e => {
				const order = e[0], user = e[1];
				return this.formBuilder.group({
					draftType: draftType,
					id: draftId,
					common: this.getOrderCommonForm(user, order),
					buyer: this.getOrderBuyerForm(user),
					supplier: this.getOrderSupplierForm(order),
					supplyPoint: this.getOrderSupplyPointForm(order),
					finalRecipient: this.getFinalRecipientForm(order),
					comment: this.getCommentForm(order),
					product: this.formBuilder.group({
						products: this.formBuilder.array((order.msgOrdersItems || []).map((e, index) => this.getOrderProductFrom(e, order.formSettings && order.formSettings.items[index], "ORDERS"))),
						totalQuantity: [order.totalQuantity],
						totalQuantityLu: [order.totalQuantityLu],
						totalAmountWithoutVat: [order.totalAmountWithoutVat],
						totalAmountVat: [order.totalAmountVat],
						totalAmountWithVat: [order.totalAmountWithVat],
						autoSum: [order.formSettings && order.formSettings.autoSum]
					})
				});
			})
		);
	}

	public getOrderCommonForm(userAndOrganizationInfo?: UserAndOrganizationInfo, initValue?: OrderParams): FormGroup {
		const order = initValue || {} as Partial<OrderParams>;
		const userProfile: UserProfile = userAndOrganizationInfo && userAndOrganizationInfo.userProfile || {} as UserProfile;
		const userProfileName = userProfile.lastName || userProfile.firstName || userProfile.middleName ? `${userProfile.lastName || ""} ${userProfile.firstName || ""} ${userProfile.middleName || ""}` : "";
		const orderContactName: string = order.orderContactName || userProfileName;
		const orderKind: OrderKind | undefined = order.documentNameCode || userAndOrganizationInfo && userAndOrganizationInfo.orderKind;
		return this.formBuilder.group({
			deliveryError: [order.deliveryError],
			errorText: [order.deliveryError],
			processingStatusId: this.formBuilder.control({ value: order.processingStatus || null, disabled: true }),
			deliveryStatus: [order.deliveryStatus],
			deliveryStatusId: [null],
			orderNumber: this.formBuilder.control({ value: order.id || null, disabled: true }),
			senderOrderNumber: this.formBuilder.control({ value: order.documentNumber || null, disabled: true }),
			orderDate: this.formBuilder.control({ value: order.documentDate && new Date(order.documentDate) || new Date(), disabled: true }),
			orderKindId: this.formBuilder.control({ value: orderKind || null, disabled: true }),
			contractNumber: [order.contractNumber, [Validators.maxLength(255)]],
			deliveryDate: [order.deliveryDate && new Date(order.deliveryDate), [Validators.required]],
			shipmentDate: [order.shipmentDate && new Date(order.shipmentDate)],
			currency: [order.currency || { id: 1, code: "BYN", name: "Белорусский рубль" }, [Validators.required]],
			orderContactName: [orderContactName.slice(0, 35), [Validators.maxLength(35)]],
			orderContactEmail: [order.orderContactEmail, [Validators.maxLength(255)]],
			orderContactPhone: [order.orderContactPhone, [Validators.maxLength(255)]],
			originalOrdersId: [order.originalOrdersId],
			responseDate: [order.ordrspDeliveryDate || new Date(), Validators.required],
			msgDate: [order.msgDate && new Date(order.msgDate)],
			msgNumber: [order.msgNumber]
		});
	}

	public getOrderBuyerForm(userAndOrganizationInfo?: UserAndOrganizationInfo): FormGroup {
		const organizationInfo = userAndOrganizationInfo && userAndOrganizationInfo.organizationInfo || {} as Partial<Organization>;
		return this.formBuilder.group({
			buyerId: [organizationInfo.id],
			buyerName: [organizationInfo.name, [Validators.required, Validators.maxLength(255)]],
			buyerGln: [organizationInfo.gln, [Validators.required, Validators.maxLength(13)]]
		});
	}

	public getOrderSupplierForm(initValue?: OrderParams): FormGroup {
		const order = initValue || {} as OrderParams;
		return this.formBuilder.group({
			supplierId: [order.supplierId],
			supplierName: [order.supplierName, [Validators.required, Validators.maxLength(255)]],
			supplierGln: this.formBuilder.control({ value: order.supplierGln || null, disabled: true }, Validators.maxLength(13))
		});
	}

	public getOrderSupplyPointForm(initValue?: OrderParams): FormGroup {
		const order = initValue || {} as OrderParams;
		return this.formBuilder.group({
			dictionary: [initValue && (initValue.deliveryPointAddress || initValue.deliveryPointName) ? {
				addressFull: initValue.deliveryPointAddress || null,
				storageName: initValue.deliveryPointName || null
			} : null, Validators.required],
			deliveryPointGln: this.formBuilder.control({
				value: order.deliveryPointGln || null,
				disabled: true
			}, { validators: [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN(), Validators.required] }),
			deliveryPointAddress: [order.deliveryPointAddress || null, Validators.maxLength(255)],
			deliveryPointName: [order.deliveryPointName || null, [Validators.maxLength(255)]],
			deliveryPointId: [order.deliveryPointId || null]
		});
	}

	public getFinalRecipientForm(initValue?: OrderParams): FormGroup {
		const order = initValue || {} as OrderParams;
		return this.formBuilder.group({
			ultimateRecipientGln: [order.ultimateRecipientGln, [Validators.maxLength(13), Validators.minLength(13), ValidatorsUtil.checkSumGLN()]],
			ultimateRecipientAddress: [order.ultimateRecipientAddress, [Validators.maxLength(255)]]
		});
	}

	public getCommentForm(initValue?: OrderParams): FormGroup {
		const order = initValue || {} as OrderParams;
		return this.formBuilder.group({
			commentText: [order.orderComment],
		});
	}

	public getOrderProductFrom(initValue?: OrderProductParams, autoSum?: boolean, messageType?: Extract<MessageType, "ORDERS" | "ORDRSP">): FormGroup {
		const product = initValue || {} as OrderProductParams;
		const autoSumFlag: boolean = autoSum !== undefined ? autoSum : true;
		return this.formBuilder.group({
			position: this.formBuilder.control({ value: product.position, disabled: true }, Validators.maxLength(35)),
			action: [initValue && initValue.action || 1],
			gtin: [product.gtin, [Validators.maxLength(14), ValidatorsUtil.checkSumGTIN()]],
			codeByBuyer: [product.codeByBuyer, Validators.maxLength(35)],
			codeBySupplier: [product.codeBySupplier, Validators.maxLength(35)],
			fullName: [product.fullName, [Validators.maxLength(512), Validators.required]],
			uom: [product.uom && {
				id: product.uom && product.uom.id,
				name: product.uom && product.uom.name,
				alpha3: product.uom && product.uom.alpha3
			}, Validators.required],
			priceNet: [product.priceNet, Validators.maxLength(35)],
			vatRate: [product.vatRate, Validators.maxLength(4)],
			quantityOrdered: this.formBuilder.control({ value: product.quantityOrdered || null, disabled: messageType === "ORDRSP" ? true : false }, [Validators.maxLength(15), Validators.required]),
			quantityOrderedLu: [product.quantityOrderedLu, Validators.maxLength(15)],
			quantityAccepted: [product.quantityAccepted, messageType === "ORDRSP" ? [Validators.maxLength(15), Validators.required] : Validators.maxLength(15)],
			quantityInPack: product.quantityInPack,
			type: this.formBuilder.control({ value: product.type || null, disabled: messageType === "ORDRSP" ? true : false }),
			amountWithoutVat: product.amountWithoutVat,
			amountVat: product.amountVat,
			amountWithVat: product.amountWithVat,
			autoSum: autoSumFlag,
			forbidDeleting: messageType === "ORDRSP" ? true : false
		});
	}
}
