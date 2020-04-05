import { ChangeDetectionStrategy, Component, ViewChild, ElementRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { Store } from "@ngrx/store";
import { ShipmentNotificationsState } from "@app/user/documents/shipment-notification/shipment-notification.reducer";
import { Observable, Subject } from "rxjs";
import { Storage, TypedStoragesParams } from "@helper/abstraction/storages";
import { take, takeUntil } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { ShipmentNotificationFormBuilderService } from "@app/user/documents/shipment-notification/shipment-notification-form-builder.service";
import {
	ShipmentNotificationProduct,
	ShipmentNotificationFormValue,
} from "@helper/abstraction/shipment-notification";
import { TotalSums } from "@app/user/documents/shipment-notification/total-sums";
import { notNull } from "@helper/operators";
import { ShipmentNotificationEditTotalSumsComponent } from "@app/user/documents/shipment-notification/shipment-notification-edit-total-sums/shipment-notification-edit-total-sums.component";

import * as ShipmentNotificationsActions from "../shipment-notification.actions";
import { ShipmentNotificationSelectorService } from "../shipment-notification-selector.service";
import { TemplateUtil } from "@helper/template-util";
import { UserErrorsService } from "@app/user/user-core/user-errors.service";
import { UserFilterService } from "@app/user/user-core/user-filter.service";
import { ValidatorsUtil } from "@helper/validators-util";
import { Actions, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { documentState } from "@helper/paths";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification",
	templateUrl: "./shipment-notification.component.html",
	styleUrls: ["./shipment-notification.component.scss"]
})
export class ShipmentNotificationComponent {
	public form$: Observable<FormGroup>;
	public buyersParams: PartnersParams = {
		page: 0,
		searchText: "",
		size: 30,
		documentTypeId: "DESADV"
	};
	public shipmentPlacesParams: TypedStoragesParams = {
		page: 0,
		searchText: "",
		size: 30,
		documentTypeId: "DESADV",
		storageTypeId: "UNLOADING_PLACE"
	};
	public deliveryStoragesParams: TypedStoragesParams = {
		page: 0,
		searchText: "",
		size: 30,
		documentTypeId: "DESADV",
		storageTypeId: "DELIVERY_PLACE"
	};
	public buyers$?: Observable<[Partner, string][]>;
	public products$?: Observable<ShipmentNotificationProduct[]>;
	public deliveryStorages$?: Observable<[Storage, string][]>;
	public shipmentPlaces$?: Observable<[Storage, string][]>;
	public totalSums$?: Observable<TotalSums>;
	public draftId?: string;
	private unsubscribe$$: Subject<void> = new Subject<void>();
	private texts: Map<string, string> = new Map<string, string>();

	constructor(
		private readonly router: Router,
		private readonly store: Store<ShipmentNotificationsState>,
		private readonly overlayService: OverlayService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly shipmentNotificationSelectorService: ShipmentNotificationSelectorService,
		private readonly shipmentNotificationFormBuilderService: ShipmentNotificationFormBuilderService,
		private readonly userFilterService: UserFilterService<ShipmentNotificationsState>,
		private readonly userErrorsService: UserErrorsService,
		private readonly actions$: Actions
	) {
		this.draftId = this.activatedRoute.snapshot.params.id;

		this.form$ = this.shipmentNotificationFormBuilderService.getForm$(this.draftId);

		this.form$.pipe(
			notNull(),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe((form) => {
			this.buyers$ = this.shipmentNotificationSelectorService.selectDictionariesFromStore$<Partner>(
				buyer => buyer.name,
				state => state.buyers
			).pipe(takeUntil(this.unsubscribe$$));
			this.deliveryStorages$ = this.shipmentNotificationSelectorService.selectDictionariesFromStore$<Storage>(
				storage => [storage.addressFull, storage.storageName].filter(e => !!e).join(", "),
				state => state.deliveryStorages
			).pipe(takeUntil(this.unsubscribe$$));
			this.shipmentPlaces$ = this.shipmentNotificationSelectorService.selectDictionariesFromStore$<Storage>(
				storage => [storage.addressFull, storage.storageName].filter(e => !!e).join(", "),
				state => state.shipmentPlaces
			).pipe(takeUntil(this.unsubscribe$$));
			this.products$ = this.shipmentNotificationSelectorService.select$<ShipmentNotificationProduct[]>(
				state => state.products
			).pipe(takeUntil(this.unsubscribe$$));
			this.totalSums$ = this.shipmentNotificationSelectorService.select$<TotalSums>(
				state => state.totalSums
			).pipe(takeUntil(this.unsubscribe$$));

			this.buyersFilterChanged("");
			this.shipmentPlacesFilterChanged("");
			this.deliveryPlacesFilterChanged("");

			if (this.draftId) {
				// if (draft.msgDesadvItems) {
				// 	this.store.dispatch(ShipmentNotificationsActions.setDocuments(draft.msgDesadvItems));
				// }
				const value: ShipmentNotificationFormValue = form.getRawValue();
				this.onBuyerFormValueChanges(value.buyer.buyerId);
			}
		});
	}

	@ViewChild("textsTemplate", { static: true })
	public set textsTemplate(value: ElementRef) {
		this.texts = TemplateUtil.getMap(value.nativeElement);
	}


	public buyersFilterChanged(search?: string): void {
		this.userFilterService.updateFilter(this.buyersParams, ShipmentNotificationsActions.resetBuyers, ShipmentNotificationsActions.getBuyers, search);
	}

	public shipmentPlacesFilterChanged(search?: string): void {
		this.userFilterService.updateFilter(this.shipmentPlacesParams, ShipmentNotificationsActions.resetShipmentPlaces, ShipmentNotificationsActions.getShipmentPlaces, search);
	}

	public deliveryPlacesFilterChanged(search?: string): void {
		this.userFilterService.updateFilter(this.deliveryStoragesParams, ShipmentNotificationsActions.resetDeliveryStorages, ShipmentNotificationsActions.getDeliveryStorages, search);
	}

	public onBuyerFormValueChanges(buyerId: number | undefined, form?: FormGroup): void {
		if (buyerId === this.deliveryStoragesParams.partnerId)
			return;
		this.deliveryStoragesParams.partnerId = buyerId;
		if (form && form.get("deliveryPlace"))
			(form.get("deliveryPlace") as FormGroup).reset({}, { emitEvent: false });
		this.deliveryPlacesFilterChanged("");
	}

	public fillRecipientHandler(fillBy: "CUSTOMER" | "PROVIDER", form: FormGroup): void {
		if (fillBy === "CUSTOMER") {
			const { buyerName: name, buyerGln: gln, buyerUnp: unp } = (form.get("buyer") as FormGroup).getRawValue();
			this.fillFreigthPayer(name, gln, unp, form);
		} else {
			const { supplierName: name, supplierGln: gln, supplierUnp: unp } = (form.get("supplier") as FormGroup).getRawValue();
			this.fillFreigthPayer(name, gln, unp, form);
		}
	}

	public fillFreigthPayer(name: string, gln: string, unp: string, form: FormGroup): void {
		(form.get("transportationCustomer") as FormGroup).patchValue({
			freightPayerName: name,
			freightPayerGln: gln,
			freightPayerUnp: unp
		});
	}

	public save(form: FormGroup): void {
		if (!form.getRawValue().products.products.length) {
			this.overlayService.showNotification$(this.texts.get("emptyProducts") || "", "error");
			return;
		}

		this.store.dispatch(ShipmentNotificationsActions.saveShipmentNotification(form.getRawValue()));
	}

	public changeTotalSums(form: FormGroup): void {
		// const component = this.overlayService.show(ShipmentNotificationEditTotalSumsComponent, { centerPosition: true });
		// component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());

		const productForm: FormGroup = form.get("products") as FormGroup;
		const component = this.overlayService.show(ShipmentNotificationEditTotalSumsComponent, {
			inputs: {
				form: productForm.get("totalSums"),
			},
			centerPosition: true
		});
		// this.changeDetectorRef.detectChanges();
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (this.overlayService) {
				this.overlayService.clear();
				// this.changeDetectorRef.detectChanges();
			}
		});
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.texts.get("deletionPopupText") || "",
			this.texts.get("deletionPopupAgreeButton"),
			this.texts.get("deletionPopupDisagreeButton")
		).then((agree: boolean) => {
			if (agree && this.draftId)
				this.store.dispatch(ShipmentNotificationsActions.deleteShipmentNotificationDraft([+this.draftId]));
		});
	}

	public send(form: FormGroup): void {
		if (!form.getRawValue().products.products.length) {
			this.overlayService.showNotification$(this.texts.get("emptyProducts") || "", "error");
			return;
		}

		if (form.invalid) {
			ValidatorsUtil.triggerValidation(form);
			this.userErrorsService.displayErrors(form);
			return;
		}

		this.actions$.pipe(
			ofType(ShipmentNotificationsActions.sendShipmentNotificationDraftError),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(err => {
			let m = "";
			if (err instanceof HttpErrorResponse) {
				m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
			} else {
				m = err.error.message;
			}
			this.overlayService.showNotification$(m, "error");
		});

		this.store.dispatch(ShipmentNotificationsActions.sendShipmentNotificationDraft(form.getRawValue()));
	}

	public goBack(): void {
		this.router.navigate(
			["user", "documents", "DESADV", documentState.draft]
		);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.store.dispatch(ShipmentNotificationsActions.resetShipmentNotifications());
		this.store.dispatch(ShipmentNotificationsActions.resetProducts());
	}
}
