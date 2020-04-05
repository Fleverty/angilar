import { NgModule } from "@angular/core";
import { EinvoicepmtComponent } from "./einvoicepmt/einvoicepmt.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { EinvoicepmtCommonComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-common/einvoicepmt-common.component";
import { EinvoicepmtFormBuilderService } from "./einvoicepmt-form-builder.service";
import { EinvoicepmtSupplierComponent } from "./einvoicepmt-supplier/einvoicepmt-supplier.component";
import { EinvoicepmtBuyerComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-buyer/einvoicepmt-buyer.component";
import { EinvoicepmtShipperComponent } from "./einvoicepmt-shipper/einvoicepmt-shipper.component";
import { EinvoicepmtReceiverComponent } from "./einvoicepmt-receiver/einvoicepmt-receiver.component";
import { EinvoicepmtAdditionalFieldsComponent } from "./einvoicepmt-additional-fields/einvoicepmt-additional-fields.component";
import { EinvoicepmtProductsListComponent } from "./einvoicepmt-products-list/einvoicepmt-products-list.component";
import { EinvoicepmtProductPopupComponent } from "./einvoicepmt-product-popup/einvoicepmt-product-popup.component";
import { EinvoicepmtProductAdditionalFieldsComponent } from "./einvoicepmt-product-additional-fields/einvoicepmt-product-additional-fields.component";
import { Action, StoreModule } from "@ngrx/store";
import { reducer } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { EffectsModule } from "@ngrx/effects";
import { EinvoicepmtEffects } from "./einvoicepmt-store/einvoicepmt.effects";
import { EinvoicepmtTransformService } from "@app/user/documents/einvoicepmt/einvoicepmt-transform.service";
import { EinvoicepmtViewMainInfoComponent } from "./einvoicepmt-view-main-info/einvoicepmt-view-main-info.component";
import { EinvoicepmtSignedDraftComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-signed-draft/einvoicepmt-signed-draft.component";
import { EinvoicepmtViewProductsListComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-view-products-list/einvoicepmt-view-products-list.component";
import { EinvoicepmtResolverService } from "./einvoicepmt-resolver.service";
import { EinvoicepmtEditTotalSumsComponent } from "./einvoicepmt-edit-total-sums/einvoicepmt-edit-total-sums.component";
import { OverlayService } from "@core/overlay.service";
import { getEinvoicepmtDocumentDraft } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.actions";
import { MessageType } from "@helper/abstraction/documents";
import { documentState } from "@helper/paths";
import { EinvoicepmtSendingComponent } from "./einvoicepmt-sending/einvoicepmt-sending.component";
import { EinvoicepmtIncomingTransferredComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-incoming-transferred/einvoicepmt-incoming-transferred.component";
import { EinvoicepmtOutgoingTransferredComponent } from "./einvoicepmt-outgoing-transferred/einvoicepmt-outgoing-transferred.component";
import { SharedEinvoicepmtSignatureComponent } from "./einvoicepmt-signature/shared-einvoicepmt-signature/shared-einvoicepmt-signature.component";
import { EinvoicepmtIncomingReceivedComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-incoming-received/einvoicepmt-incoming-received.component";
import { EinvoicepmtOutgoingReceivedComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-outgoing-received/einvoicepmt-outgoing-received.component";
import { EinvoicepmtViewConfirmationComponent } from "./einvoicepmt-view-confirmation/einvoicepmt-view-confirmation.component";

export function draftAction(draftType: MessageType, draftId: number): Action {
	return getEinvoicepmtDocumentDraft(draftType, draftId);
}

const ROUTES: Routes = [
	{
		path: "create",
		component: EinvoicepmtComponent
	},
	{
		path: "edit/:id",
		component: EinvoicepmtComponent
	},
	{
		path: "signed-draft/:id",
		component: EinvoicepmtSignedDraftComponent,
		resolve: {
			document: EinvoicepmtResolverService
		},
		data: {
			action: draftAction
		}
	},
	{
		path: documentState.draft,
		children: [
			{
				path: "sending/:id",
				component: EinvoicepmtSendingComponent,
				resolve: {
					document: EinvoicepmtResolverService
				},
				data: {
					action: draftAction
				}
			}
		]
	},
	{
		path: documentState.outgoing,
		children: [
			{
				path: "sending/:id",
				component: EinvoicepmtSendingComponent,
				resolve: {
					document: EinvoicepmtResolverService
				},
			},
			{
				path: "transferred/:id",
				component: EinvoicepmtOutgoingTransferredComponent,
				resolve: {
					document: EinvoicepmtResolverService
				}
			},
			{
				path: "received/:id",
				component: EinvoicepmtOutgoingReceivedComponent,
				resolve: {
					document: EinvoicepmtResolverService
				}
			}
		]
	},
	{
		path: documentState.incoming,
		children: [
			{
				path: "sending/:id",
				component: EinvoicepmtSendingComponent,
				resolve: {
					document: EinvoicepmtResolverService
				}
			},
			{
				path: "transferred/:id",
				component: EinvoicepmtIncomingTransferredComponent,
				resolve: {
					document: EinvoicepmtResolverService
				}
			},
			{
				path: "received/:id",
				component: EinvoicepmtIncomingReceivedComponent,
				resolve: {
					document: EinvoicepmtResolverService
				}
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES),
		EffectsModule.forFeature([EinvoicepmtEffects]),
		StoreModule.forFeature("einvoicepmt", reducer),
	],
	declarations: [
		EinvoicepmtComponent,
		EinvoicepmtCommonComponent,
		EinvoicepmtSupplierComponent,
		EinvoicepmtBuyerComponent,
		EinvoicepmtShipperComponent,
		EinvoicepmtReceiverComponent,
		EinvoicepmtAdditionalFieldsComponent,
		EinvoicepmtProductsListComponent,
		EinvoicepmtProductPopupComponent,
		EinvoicepmtProductAdditionalFieldsComponent,
		EinvoicepmtSignedDraftComponent,
		EinvoicepmtViewMainInfoComponent,
		EinvoicepmtViewProductsListComponent,
		EinvoicepmtEditTotalSumsComponent,
		EinvoicepmtSendingComponent,
		EinvoicepmtIncomingTransferredComponent,
		EinvoicepmtOutgoingTransferredComponent,
		SharedEinvoicepmtSignatureComponent,
		EinvoicepmtIncomingReceivedComponent,
		EinvoicepmtOutgoingReceivedComponent,
		EinvoicepmtViewConfirmationComponent
	],
	entryComponents: [
		EinvoicepmtProductPopupComponent,
		EinvoicepmtEditTotalSumsComponent
	],
	providers: [
		OverlayService,
		EinvoicepmtFormBuilderService,
		EinvoicepmtResolverService,
		EinvoicepmtTransformService
	]
})
export class EinvoicepmtModule {

}
