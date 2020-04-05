import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { Route } from "@angular/router";
import { EinvoiceComponent } from "./einvoice/einvoice.component";
import { EinvoiceFormBuilderService } from "./services/einvoice-form-builder.service";
import { OverlayService } from "@core/overlay.service";
import { EinvoiceTransformService } from "./services/einvoice-transform.service";
import { EinvoiceService } from "./services/einvoice.service";
import { EinvoiceSelectorService } from "./services/einvoice-selector.service";
import { EinvoiceResolverService } from "./services/einvoice-resolver.service";
import { EinvoiceExtraInformationComponent } from "./einvoice-extra-information/einvoice-extra-information.component";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule, Action } from "@ngrx/store";
import { reducer } from "./einvoice.reducer";
import { EinvoiceCommonInformationComponent } from "./einvoice-common-information/einvoice-common-information.component";
import { EinvoiceSupplierComponent } from "./einvoice-supplier/einvoice-supplier.component";
import { EinvoiceBuyerComponent } from "./einvoice-buyer/einvoice-buyer.component";
import { EinvoicePlacesShipmentDeliveryComponent } from "./einvoice-places-shipment-delivery/einvoice-places-shipment-delivery.component";
import { EinvoiceProductsListComponent } from "./einvoice-products-list/einvoice-products-list.component";
import { EinvoiceProductPopupComponent } from "./einvoice-product-popup/einvoice-product-popup.component";
import { EinvoiceEditTotalSumsComponent } from "./einvoice-edit-total-sums/einvoice-edit-total-sums.component";
import { EinvoiceShipperComponent } from "./einvoice-shipper/einvoice-shipper.component";
import { EinvoiceConsigneeComponent } from "./einvoice-consignee/einvoice-consignee.component";
import { EinvoiceRemoveButtonComponent } from "./einvoice-remove-button/einvoice-remove-button.component";
import { EinvoiceDraftEffects } from "./einvoice-actions/einvoice-draft.effects";
import { EinvoiceSignEffects } from "./einvoice-actions/einvoice-sign.effects";
import { EinvoiceSignedDraftComponent } from "./einvoice-signed-draft/einvoice-signed-draft.component";
import { EinvoiceCommomInfoViewComponent } from "./einvoice-commom-info-view/einvoice-commom-info-view.component";
import { EinvoiceProductAdditionalFieldsComponent } from "./einvoice-product-additional-fields/einvoice-product-additional-fields.component";
import { EinvoiceDeleteEffects } from "./einvoice-actions/einvoice-delete.effects";
import { EinvoiceSignDraftComponent } from "./einvoice-sign-draft/einvoice-sign-draft.component";
import { getEinvocieDraft } from "./einvoice-actions/einvoice-draft.actions";
import { EinvoiceSignedEffects } from "./einvoice-actions/einvoice-signed.effects";
import { SharedEinvoiceSignatureComponent } from "./einvoice-signature/shared-einvoice-signature/shared-einvoice-signature.component";
import { EinvoiceViewProductsComponent } from "./einvoice-view-products/einvoice-view-products.component";
import { EinvoiceSendingComponent } from "./einvoice-sending/einvoice-sending.component";
import { documentState } from "@helper/paths";
import { EinvoiceInboxTransferredComponent } from "./einvoice-inbox-transferred/einvoice-inbox-transferred.component";
import { EinvoiceOutboxTransferredComponent } from "./einvoice-outbox-transferred/einvoice-outbox-transferred.component";
import { EinvoiceOutboxCreatedComponent } from "./einvoice-outbox-created/einvoice-outbox-created.component";
import { EinvoiceInboxCreatedComponent } from "./einvoice-inbox-created/einvoice-inbox-created.component";
import { EinvoiceMainEffects } from "./einvoice-actions/einvoice-main.effects";
import { EinvoiceResponseEffects } from "./einvoice-actions/einvoice-response.effects";
import { EinvoiceViewConfirmationComponent } from "./einvoice-view-confirmation/einvoice-view-confirmation.component";
import { EinvoiceCancelEffects } from "./einvoice-actions/einvoice-cancel.effects";
import { EinvoiceInboxCanceledComponent } from "./einvoice-inbox-canceled/einvoice-inbox-canceled.component";
import { EinvoiceOutboxCanceledComponent } from "./einvoice-outbox-canceled/einvoice-outbox-canceled.component";
import { EinvoiceEditPopupComponent } from "./einvoice-edit-popup/einvoice-edit-popup.component";

export function draftAction(draftId: string): Action {
	return getEinvocieDraft(+draftId);
}

export const ROUTES: Route[] = [
	{
		path: documentState.outgoing,
		children: [
			{
				path: "transferred/:id",
				component: EinvoiceOutboxTransferredComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "sending/:id",
				component: EinvoiceSendingComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "created/:id",
				component: EinvoiceOutboxCreatedComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "canceled/:id",
				component: EinvoiceOutboxCanceledComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "not/confirmed/cancel/:id",
				component: EinvoiceOutboxCanceledComponent,
				resolve: {
					document: EinvoiceResolverService,
					processingStatus: "NOT_CONFIRMED_CANCEL"
				}
			},
		]
	},
	{
		path: documentState.incoming,
		children: [
			{
				path: "transferred/:id",
				component: EinvoiceInboxTransferredComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "created/:id",
				component: EinvoiceInboxCreatedComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "sending/:id",
				component: EinvoiceSendingComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "canceled/:id",
				component: EinvoiceInboxCanceledComponent,
				resolve: {
					document: EinvoiceResolverService
				}
			},
			{
				path: "not/confirmed/cancel/:id",
				component: EinvoiceInboxCanceledComponent,
				resolve: {
					document: EinvoiceResolverService,
					processingStatus: "NOT_CONFIRMED_CANCEL"
				}
			},
		]
	},
	{
		path: documentState.draft,
		children: [
			{
				path: "sending/:id",
				component: EinvoiceSendingComponent,
				resolve: {
					document: EinvoiceResolverService
				},
				data: {
					action: draftAction
				}
			}
		]
	},
	{
		path: "create",
		component: EinvoiceComponent,
	},
	{
		path: "edit",
		component: EinvoiceComponent,
	},
	{
		path: "sign-draft/:id",
		component: EinvoiceSignDraftComponent,
		resolve: {
			document: EinvoiceResolverService
		},
		data: {
			action: draftAction
		}
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES),
		EffectsModule.forFeature([
			EinvoiceCancelEffects,
			EinvoiceResponseEffects,
			EinvoiceDraftEffects,
			EinvoiceSignEffects,
			EinvoiceDeleteEffects,
			EinvoiceSignedEffects,
			EinvoiceMainEffects
		]),
		StoreModule.forFeature("einvoice", reducer),
	],
	declarations: [
		EinvoiceEditPopupComponent,
		EinvoiceOutboxCanceledComponent,
		EinvoiceInboxCanceledComponent,
		EinvoiceViewConfirmationComponent,
		EinvoiceInboxCreatedComponent,
		EinvoiceOutboxCreatedComponent,
		EinvoiceOutboxTransferredComponent,
		EinvoiceInboxTransferredComponent,
		EinvoiceSendingComponent,
		EinvoiceViewProductsComponent,
		SharedEinvoiceSignatureComponent,
		EinvoiceSignDraftComponent,
		EinvoiceProductAdditionalFieldsComponent,
		EinvoiceComponent,
		EinvoiceSignedDraftComponent,
		EinvoiceCommomInfoViewComponent,
		EinvoiceCommonInformationComponent,
		EinvoiceSupplierComponent,
		EinvoiceBuyerComponent,
		EinvoiceEditTotalSumsComponent,
		EinvoiceExtraInformationComponent,
		EinvoicePlacesShipmentDeliveryComponent,
		EinvoiceProductPopupComponent,
		EinvoiceProductsListComponent,
		EinvoiceShipperComponent,
		EinvoiceConsigneeComponent,
		EinvoiceRemoveButtonComponent
	],
	entryComponents: [
		EinvoiceEditPopupComponent,
		EinvoiceProductPopupComponent,
		EinvoiceEditTotalSumsComponent,
	],
	providers: [
		{ provide: "NOT_CONFIRMED_CANCEL", useValue: (): string => "NOT_CONFIRMED_CANCEL" },
		EinvoiceFormBuilderService,
		EinvoiceResolverService,
		EinvoiceSelectorService,
		EinvoiceService,
		EinvoiceTransformService,
		OverlayService,
	]
})
export class EinvoiceModule { }
