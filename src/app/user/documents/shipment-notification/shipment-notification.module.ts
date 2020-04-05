import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShipmentNotificationComponent } from "@app/user/documents/shipment-notification/shipment-notification/shipment-notification.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ShipmentNotificationCommonComponent } from "@app/user/documents/shipment-notification/shipment-notification-common/shipment-notification-common.component";
import { ShipmentNotificationBuyerComponent } from "@app/user/documents/shipment-notification/shipment-notification-buyer/shipment-notification-buyer.component";
import { StoreModule } from "@ngrx/store";
import { reducer } from "@app/user/documents/shipment-notification/shipment-notification.reducer";
import { EffectsModule } from "@ngrx/effects";
import { ShipmentNotificationEffects } from "@app/user/documents/shipment-notification/shipment-notification.effects";
import { ShipmentNotificationShipmentPlaceComponent } from "@app/user/documents/shipment-notification/shipment-notification-shipment-place/shipment-notification-shipment-place.component";
import { ShipmentNotificationDeliveryPlaceComponent } from "@app/user/documents/shipment-notification/shipment-notification-delivery-place/shipment-notification-delivery-place.component";
import { ShipmentNotificationCustomerComponent } from "@app/user/documents/shipment-notification/shipment-notification-customer/shipment-notification-customer.component";
import { ShipmentNotificationRecipientComponent } from "@app/user/documents/shipment-notification/shipment-notification-recipient/shipment-notification-recipient.component";
import { ShipmentNotificationTransportDetailsComponent } from "@app/user/documents/shipment-notification/shipment-notification-transport-details/shipment-notification-transport-details.component";
import { ShipmentNotificationResponsiblePersonsDetailsComponent } from "@app/user/documents/shipment-notification/shipment-notification-responsible-persons-details/shipment-notification-responsible-persons-details.component";
import { ShipmentNotificationProductsListComponent } from "@app/user/documents/shipment-notification/shipment-notification-products-list/shipment-notification-products-list.component";
import { OverlayService } from "@core/overlay.service";
import { ShipmentNotificationFormBuilderService } from "@app/user/documents/shipment-notification/shipment-notification-form-builder.service";
import { ShipmentNotificationViewComponent } from "@app/user/documents/shipment-notification/shipment-notification-view/shipment-notification-view.component";
import { ShipmentNotificationViewMainInfoComponent } from "@app/user/documents/shipment-notification/shipment-notification-view-main-info/shipment-notification-view-main-info.component";
import { ShipmentNotificationViewProductsComponent } from "@app/user/documents/shipment-notification/shipment-notification-view-products/shipment-notification-view-products.component";
import { ShipmentNotificationEditTotalSumsComponent } from "@app/user/documents/shipment-notification/shipment-notification-edit-total-sums/shipment-notification-edit-total-sums.component";
import { ShipmentNotificationSupplierComponent } from "@app/user/documents/shipment-notification/shipment-notification-supplier/shipment-notification-supplier.component";
import { ShipmentNotificationsResolverService } from "./shipment-notification-resolver.service";
import { ShipmentNotificationSelectorService } from "./shipment-notification-selector.service";
import { ShipmentNotificationProductPopupComponent } from "./shipment-notification-product-popup/shipment-notification-product-popup.component";
import { documentState } from "@helper/paths";
import { ShipmentNotificationStatusService } from "./shipment-notification-status.service";

const ROUTES: Routes = [
	{
		path: documentState.outgoing,
		children: [
			{
				path: "accepted/:id",
				component: ShipmentNotificationViewComponent,
				resolve: {
					document: ShipmentNotificationsResolverService
				},
				data: {
					status: documentState.outgoing
				}
			},
			{
				path: "transferred/:id",
				component: ShipmentNotificationViewComponent,
				resolve: {
					document: ShipmentNotificationsResolverService
				},
				data: {
					status: documentState.outgoing
				}
			}
		]
	},
	{
		path: documentState.incoming,
		children: [
			{
				path: "accepted/:id",
				component: ShipmentNotificationViewComponent,
				resolve: {
					document: ShipmentNotificationsResolverService
				},
				data: {
					status: documentState.incoming
				}
			},
			{
				path: "transferred/:id",
				component: ShipmentNotificationViewComponent,
				resolve: {
					document: ShipmentNotificationsResolverService
				},
				data: {
					status: documentState.incoming
				}
			}
		]
	},
	{
		path: "create",
		component: ShipmentNotificationComponent
	},
	{
		path: "edit/:id",
		component: ShipmentNotificationComponent,
	},
	{
		path: "view",
		component: ShipmentNotificationViewProductsComponent
	}
];

@NgModule({
	declarations: [
		ShipmentNotificationComponent,
		ShipmentNotificationCommonComponent,
		ShipmentNotificationBuyerComponent,
		ShipmentNotificationShipmentPlaceComponent,
		ShipmentNotificationDeliveryPlaceComponent,
		ShipmentNotificationCustomerComponent,
		ShipmentNotificationRecipientComponent,
		ShipmentNotificationTransportDetailsComponent,
		ShipmentNotificationResponsiblePersonsDetailsComponent,
		ShipmentNotificationProductsListComponent,
		ShipmentNotificationProductPopupComponent,
		ShipmentNotificationViewComponent,
		ShipmentNotificationViewMainInfoComponent,
		ShipmentNotificationViewProductsComponent,
		ShipmentNotificationEditTotalSumsComponent,
		ShipmentNotificationSupplierComponent
	],
	entryComponents: [
		ShipmentNotificationProductPopupComponent,
		ShipmentNotificationEditTotalSumsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES),
		EffectsModule.forFeature([ShipmentNotificationEffects]),
		StoreModule.forFeature("shipmentNotifications", reducer)
	],
	providers: [
		OverlayService,
		ShipmentNotificationFormBuilderService,
		ShipmentNotificationsResolverService,
		ShipmentNotificationSelectorService,
		ShipmentNotificationStatusService
	],
})
export class ShipmentNotificationModule {

}
