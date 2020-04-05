import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { OrderCommonComponent } from "./order-common/order-common.component";
import { OrderBuyerComponent } from "./order-buyer/order-buyer.component";
import { OrderSupplierComponent } from "./order-supplier/order-supplier.component";
import { OrderSupplyPointComponent } from "./order-supply-point/order-supply-point.component";
import { OrderCommentComponent } from "./order-comment/order-comment.component";
import { OrderFinalRecipientComponent } from "./order-final-recipient/order-final-recipient.component";
import { OrderFormBuilderService } from "./order/order-form-builder.service";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { reducer } from "./orders.reducer";
import { OrdersEffects } from "./orders.effects";
import { OrdersSelectorService } from "./order-selector.service";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { OrderProductsComponent } from "./order-products/order-products.component";
import { OrderProductPopupComponent } from "./order-product-popup/order-product-popup.component";
import { OverlayService } from "@core/overlay.service";
import { OrderTransformService } from "./order/order-transform.service";
import { OrderEditTotalSumComponent } from "@app/user/documents/order/order-edit-total-sum/order-edit-total-sum.component";
import { OrderViewMainInfoComponent } from "./order-view-main-info/order-view-main-info.component";
import { OrderViewProductsComponent } from "./order-view-products/order-view-products.component";
import { OrderStatusService } from "./order-status.service";
import { OrderResponseDraftMainComponent } from "@app/user/documents/order/order-response-draft-main/order-response-draft-main.component";
import { OrderResponseDraftComponent } from "@app/user/documents/order/order-response-draft/order-response-draft.component";
import { OrderResolverService } from "@app/user/documents/order/order-resolver.service";
import { OrderOutboxTransferredComponent } from "./order-outbox-transferred/order-outbox-transferred.component";
import { OrderOutboxAcceptedComponent } from "./order-outbox-accepted/order-outbox-accepted.component";
import { OrderOutboxAcceptedWithChangesComponent } from "./order-outbox-accepted-with-changes/order-outbox-accepted-with-changes.component";
import { OrderOutboxCanceledBySupplierComponent } from "./order-outbox-canceled-by-supplier/order-outbox-canceled-by-supplier.component";
import { OrderOutboxCanceledByBuyerComponent } from "./order-outbox-canceled-by-buyer/order-outbox-canceled-by-buyer.component";
import { OrderOutboxAcceptedCanceledByBuyerComponent } from "./order-outbox-accepted-canceled-by-buyer/order-outbox-accepted-canceled-by-buyer.component";
import { OrderInboxTransferredComponent } from "./order-inbox-transferred/order-inbox-transferred.component";
import { OrderInboxAcceptedComponent } from "./order-inbox-accepted/order-inbox-accepted.component";
import { OrderInboxAcceptedWithChangesComponent } from "./order-inbox-accepted-with-changes/order-inbox-accepted-with-changes.component";
import { OrderInboxCanceledBySupplierComponent } from "./order-inbox-canceled-by-supplier/order-inbox-canceled-by-supplier.component";
import { OrderInboxCanceledByBuyerComponent } from "./order-inbox-canceled-by-buyer/order-inbox-canceled-by-buyer.component";
import { OrderInboxAcceptedCanceledByBuyerComponent } from "./order-inbox-accepted-canceled-by-buyer/order-inbox-accepted-canceled-by-buyer.component";
import { OrderHeaderComponent } from "./order-header/order-header.component";
import { OrderViewService } from "./order-view.service";
import { documentState } from "@helper/paths";

export const ROUTES: Route[] = [
	{
		path: documentState.outgoing,
		children: [
			{
				path: "transferred/:type/:code/:id",
				component: OrderOutboxTransferredComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/:type/:code/:id",
				component: OrderOutboxAcceptedComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/with/changes/:type/:code/:id",
				component: OrderOutboxAcceptedWithChangesComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "canceled/by/supplier/:type/:code/:id",
				component: OrderOutboxCanceledBySupplierComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "canceled/by/buyer/:type/:code/:id",
				component: OrderOutboxCanceledByBuyerComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/canceled/by/buyer/:type/:code/:id",
				component: OrderOutboxAcceptedCanceledByBuyerComponent,
				resolve: {
					document: OrderResolverService
				}
			},
		]
	},
	{
		path: documentState.incoming,
		children: [
			{
				path: "transferred/:type/:code/:id",
				component: OrderInboxTransferredComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/:type/:code/:id",
				component: OrderInboxAcceptedComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/with/changes/:type/:code/:id",
				component: OrderInboxAcceptedWithChangesComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "canceled/by/supplier/:type/:code/:id",
				component: OrderInboxCanceledBySupplierComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "canceled/by/buyer/:type/:code/:id",
				component: OrderInboxCanceledByBuyerComponent,
				resolve: {
					document: OrderResolverService
				}
			},
			{
				path: "accepted/canceled/by/buyer/:type/:code/:id",
				component: OrderInboxAcceptedCanceledByBuyerComponent,
				resolve: {
					document: OrderResolverService
				}
			},
		]
	},
	{
		path: documentState.draft,
		children: [
			{
				path: "response/:type/:code/:id",
				component: OrderResponseDraftComponent
			}
		]
	},
	{
		path: "create",
		component: OrderComponent,
	},
	{
		path: "edit",
		component: OrderComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		EffectsModule.forFeature([OrdersEffects]),
		StoreModule.forFeature("orders", reducer)
	],
	providers: [
		OrderViewService,
		OverlayService,
		OrderStatusService,
		OrderFormBuilderService,
		OrdersSelectorService,
		UserBackendService,
		OrderTransformService,
		OrderResolverService,
	],
	entryComponents: [
		OrderProductPopupComponent,
		OrderEditTotalSumComponent
	],
	exports: [
		OrderProductsComponent
	],
	declarations: [
		OrderHeaderComponent,
		OrderProductPopupComponent,
		OrderBuyerComponent,
		OrderCommentComponent,
		OrderCommonComponent,
		OrderComponent,
		OrderFinalRecipientComponent,
		OrderProductsComponent,
		OrderSupplierComponent,
		OrderSupplyPointComponent,
		OrderEditTotalSumComponent,
		OrderResponseDraftMainComponent,
		OrderResponseDraftComponent,
		OrderViewMainInfoComponent,
		OrderViewProductsComponent,
		OrderEditTotalSumComponent,
		OrderOutboxTransferredComponent,
		OrderOutboxAcceptedComponent,
		OrderOutboxAcceptedWithChangesComponent,
		OrderOutboxCanceledBySupplierComponent,
		OrderOutboxCanceledByBuyerComponent,
		OrderOutboxAcceptedCanceledByBuyerComponent,
		OrderInboxTransferredComponent,
		OrderInboxAcceptedComponent,
		OrderInboxAcceptedWithChangesComponent,
		OrderInboxCanceledBySupplierComponent,
		OrderInboxCanceledByBuyerComponent,
		OrderInboxAcceptedCanceledByBuyerComponent
	]
})
export class OrderModule { }
