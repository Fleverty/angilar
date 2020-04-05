import { Action, StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { Route } from "@angular/router";
import { EwaybillComponent } from "./ewaybill/ewaybill.component";
import { EwaybillProductPopupComponent } from "./ewaybill-product-popup/ewaybill-product-popup.component";
import { EwaybillCommonInformationComponent } from "./ewaybill-common-information/ewaybill-common-information.component";
import { EwaybillAttachedDocumentsComponent } from "./ewaybill-attached-documents/ewaybill-attached-documents.component";
import { EwaybillExtraInformationComponent } from "./ewaybill-extra-information/ewaybill-extra-information.component";
import { EwaybillOtherDetailsComponent } from "./ewaybill-other-details/ewaybill-other-details.component";
import { EwaybillPlacesShipmentDeliveryComponent } from "./ewaybill-places-shipment-delivery/ewaybill-places-shipment-delivery.component";
import { EwaybillProductsListComponent } from "./ewaybill-products-list/ewaybill-products-list.component";
import { OverlayService } from "@core/overlay.service";
import { EwaybillEffects } from "./ewaybill.effects";
import { EwaybillEditTotalSumsComponent } from "./ewaybill-edit-total-sums/ewaybill-edit-total-sums.component";
import { reducer } from "./ewaybill.reducer";
import { EwaybillFormBuilderService } from "./ewaybill/ewaybill-form-builder.service";
import { EwaybillViewConfirmationComponent } from "./ewaybill-view-confirmation/ewaybill-view-confirmation.component";
import { EwaybillViewMainInfoComponent } from "./ewaybill-view-main-info/ewaybill-view-main-info.component";
import { EwaybillViewProductsComponent } from "./ewaybill-view-products/ewaybill-view-products.component";
import { EwaybillSignDraftComponent } from "./ewaybill-sign-draft/ewaybill-sign-draft.component";
import { EwaybillReceivedComponent } from "./ewaybill-inbox-received/ewaybill-inbox-received.component";
import { EwaybillResponseDraftComponent } from "./ewaybill-response-draft/ewaybill-response-draft.component";
import { EwaybillMarksActsComponents } from "./ewaybill-marks-acts/ewaybill-marks-acts.component";
import { EwaybillExtraFieldsReceiverComponent } from "./ewaybill-extra-fields-receiver/ewaybill-extra-fields-receiver.component";
import { EwaybillConsigneeAcceptComponent } from "./ewaybill-consignee-accept/ewaybill-consignee-accept.component";
import { EwaybillViewResponseInfoComponent } from "./ewaybill-view-response-info/ewaybill-view-response-info.component";
import { EwaybillSelectorService } from "./ewaybill-selector.service";
import { EwaybillTransformService } from "./ewaybill-transform.service";
import { EwaybillEditPopupComponent } from "./ewaybill-edit-popup/ewaybill-edit-popup.component";
import { EwaybillOutboxTransferredComponent } from "./ewaybill-outbox-transferred/ewaybill-outbox-transferred.component";
import { EwaybillOutboxReceivedComponent } from "./ewaybill-outbox-received/ewaybill-outbox-received.component";
import { EwaybillOutboxCreatedComponent } from "./ewaybill-outbox-created/ewaybill-outbox-created.component";
import { EwaybillOutboxCanceledComponent } from "./ewaybill-outbox-canceled/ewaybill-outbox-canceled.component";
import { EwaybillOutboxChangeRequiredComponent } from "./ewaybill-outbox-change-required/ewaybill-outbox-change-required.component";
import { EwaybillOutboxCreatedConfirmedComponent } from "./ewaybill-outbox-created-confirmed/ewaybill-outbox-created-confirmed.component";
import { EwaybillOutboxNotConfirmedCancelComponent } from "./ewaybill-outbox-not-confirmed-cancel/ewaybill-outbox-not-confirmed-cancel.component";
import { EwaybillOutboxChangeRequiredNotConfirmComponent } from "./ewaybill-outbox-change-required-not-confirm/ewaybill-outbox-change-required-not-confirm.component";
import { EwaybillOutboxCreatedCancelSentComponent } from "./ewaybill-outbox-created-cancel-sent/ewaybill-outbox-created-cancel-sent.component";
import { EwaybillOutboxCreatedConfirmCancelSentComponent } from "./ewaybill-outbox-created-confirm-cancel-sent/ewaybill-outbox-created-confirm-cancel-sent.component";
import { EwaybillResolverService } from "./ewaybill-resolver.service";
import { EwaybillInboxCreatedComponent } from "./ewaybill-inbox-created/ewaybill-inbox-created.component";
import { EwaybillTransferredInboxComponent } from "./ewaybill-inbox-transferred/ewaybill-inbox-transferred.component";
import { EwaybillInboxCanceledComponent } from "./ewaybill-inbox-canceled/ewaybill-inbox-canceled.component";
import { getEwaybillResponse, getEwaybill } from "@app/user/documents/ewaybill/ewaybill.actions";
import { DraftType } from "@helper/abstraction/draft";
import { EwaybillInboxChangeRequiredComponent } from "./ewaybill-inbox-change-required/ewaybill-inbox-change-required.component";
import { EwaybillProductSafetyAndQualityComponent } from "@app/user/documents/ewaybill/ewaybill-product-safety-and-quality/ewaybill-product-safety-and-quality.component";
import { EwaybillSendingComponent } from "./ewaybill-sending/ewaybill-sending.component";
import { EwaybillInboxChangeRequiredNotConfirmComponent } from "./ewaybill-inbox-change-required-not-confirm/ewaybill-inbox-change-required-not-confirm.component";
import { EwaybillProductAdditionalFieldsComponent } from "./ewaybill-product-additional-fields/ewaybill-product-additional-fields.component";
import { EwaybillResponseSignDraftComponent } from "./ewaybill-response-sign-draft/ewaybill-response-sign-draft.component";
import { EwaybillShipperInformationComponent } from "./ewaybill-shipper-information/ewaybill-shipper-information.component";
import { EwaybillReceiverInformationComponent } from "@app/user/documents/ewaybill/ewaybill-receiver-information/ewaybill-receiver-information.component";
import { EwaybillFreightPayerInformationComponent } from "@app/user/documents/ewaybill/ewaybill-freight-payer-information/ewaybill-freight-payer-information.component";
import { CurrentOrganizationEqualReceiverEqualShipperComponent } from "@app/user/documents/ewaybill/ewaybill-view-confirmation/current-organization-equal-receiver-equal-shipper/current-organization-equal-receiver-equal-shipper.component";
import { CurrentOrganizationEqualReceiverNotEqualShipperComponent } from "@app/user/documents/ewaybill/ewaybill-view-confirmation/current-organization-equal-receiver-not-equal-shipper/current-organization-equal-receiver-not-equal-shipper.component";
import { CurrentOrganizationEqualShipperNotEqualReceiverComponent } from "@app/user/documents/ewaybill/ewaybill-view-confirmation/current-organization-equal-shipper-not-equal-receiver/current-organization-equal-shipper-not-equal-receiver.component";
import { EwaybillDraftSignatureComponent } from "@app/user/documents/ewaybill/ewaybill-signature/ewaybill-draft-signature/ewaybill-draft-signature.component";
import { SharedEwaybillSignatureComponent } from "@app/user/documents/ewaybill/ewaybill-signature/shared-ewaybill-signature/shared-ewaybill-signature.component";
import { EwaybillCancelSignatureComponent } from "@app/user/documents/ewaybill/ewaybill-signature/ewaybill-cancel-signature/ewaybill-cancel-signature.component";
import { documentState } from "@helper/paths";
import { EwaybillCancelEffects } from "./ewaybill-cancel/ewaybill-cancel.effects";
import { EwaybillStatisticViewComponent } from "./ewaybill-statistic/ewaybill-statistic-view.component";
import { EwaybillInboxCreatedCancelSentComponent } from "./ewaybill-inbox-created-cancel-sent/ewaybill-inbox-created-cancel-sent.component";

export function responseAction(draftType: DraftType, draftId: string): Action {
	return getEwaybillResponse(draftType, draftId);
}

export function draftResponseAction(draftType: DraftType, draftId: string): Action {
	return (draftType === "BLRWBR" || draftType === "BLRDNR") ? getEwaybillResponse(draftType, draftId) : getEwaybill(draftType, draftId);
}

// export function receivedDocumentResponceAction(documentType: MessageType, documentId: string): Action {
// 	return getReceivedEwaybill({ documentType, documentId });
// }
export const ROUTES: Route[] = [
	{
		path: documentState.outgoing,
		children: [
			{
				path: "transferred/:type/:id",
				component: EwaybillOutboxTransferredComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "received/:type/:id",
				component: EwaybillOutboxReceivedComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "created/:type/:id",
				component: EwaybillOutboxCreatedComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "canceled/:type/:id",
				component: EwaybillOutboxCanceledComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "change/required/:type/:id",
				component: EwaybillOutboxChangeRequiredComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "created/confirmed/:type/:id",
				component: EwaybillOutboxCreatedConfirmedComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "not/confirmed/cancel/:type/:id",
				component: EwaybillOutboxNotConfirmedCancelComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "change/required/not/confirmed/:type/:id",
				component: EwaybillOutboxChangeRequiredNotConfirmComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "created/cancel/sent/:type/:id",
				component: EwaybillOutboxCreatedCancelSentComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "created/confirm/cancel/sent/:type/:id",
				component: EwaybillOutboxCreatedConfirmCancelSentComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "sending/:type/:id",
				component: EwaybillSendingComponent,
				resolve: {
					document: EwaybillResolverService
				}
			}
		]
	},
	{
		path: documentState.incoming,
		children: [
			{
				path: "transferred/:type/:id",
				component: EwaybillTransferredInboxComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "received/:type/:id",
				component: EwaybillReceivedComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "canceled/:type/:id",
				component: EwaybillInboxCanceledComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "canceled/not/confirmed/:type/:id",
				component: EwaybillInboxCanceledComponent,
				resolve: {
					document: EwaybillResolverService,
					processingStatus: "NOT_CONFIRMED_CANCEL"
				}
			},
			{
				path: "created/:type/:id",
				component: EwaybillInboxCreatedComponent,
				resolve: {
					document: EwaybillResolverService,
					processingStatus: "CREATED"
				}
			},
			{
				path: "created/confirmed/:type/:id",
				component: EwaybillInboxCreatedComponent, // without accept income
				resolve: {
					document: EwaybillResolverService,
					processingStatus: "CREATED_CONFIRMED"
				}
			},
			{
				path: "created/cancel/sent/:type/:id",
				component: EwaybillInboxCreatedCancelSentComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "created/confirmed/cancel/sent/:type/:id",
				component: EwaybillInboxCreatedCancelSentComponent,
				resolve: {
					document: EwaybillResolverService
				}
			},
			{
				path: "change/required/:type/:id",
				component: EwaybillInboxChangeRequiredComponent,
				resolve: {
					document: EwaybillResolverService,
					processingStatus: "CHANGE_REQUIRED"
				}
			},
			{
				path: "change/required/not/confirmed/:type/:id",
				component: EwaybillInboxChangeRequiredNotConfirmComponent,
				resolve: {
					document: EwaybillResolverService,
					processingStatus: "CHANGE_REQUIRED_NOT_CONFIRMED"
				}
			},
			{
				path: "sending/:type/:id",
				component: EwaybillSendingComponent,
				resolve: {
					document: EwaybillResolverService,
				}
			}
		]
	},
	{
		path: documentState.draft,
		children: [
			{
				path: "response/:type/:id",
				component: EwaybillResponseDraftComponent,
				resolve: {
					document: EwaybillResolverService
				},
				data: {
					action: responseAction
				}
			},
			{
				path: "sending/:type/:id",
				component: EwaybillSendingComponent,
				resolve: {
					document: EwaybillResolverService
				},
				data: {
					action: draftResponseAction
				}
			}
		]
	},
	{
		path: "create",
		component: EwaybillComponent,
	},
	{
		path: "edit",
		component: EwaybillComponent,
	},
	{
		path: "sign-draft/:type/:id",
		component: EwaybillSignDraftComponent,
		resolve: {
			document: EwaybillResolverService
		},
		data: {
			action: draftResponseAction
		}
	},
	{
		path: "response/sign-draft/:type/:id",
		component: EwaybillResponseSignDraftComponent,
		resolve: {
			document: EwaybillResolverService
		},
		data: {
			action: responseAction
		}
	},
	{
		path: "statistic/view/:type/:id",
		component: EwaybillStatisticViewComponent,
		resolve: {
			document: EwaybillResolverService
		},
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES),
		EffectsModule.forFeature([EwaybillEffects, EwaybillCancelEffects]),
		StoreModule.forFeature("ewaybill", reducer),
	],
	declarations: [
		EwaybillProductSafetyAndQualityComponent,
		EwaybillEditPopupComponent,
		EwaybillComponent,
		EwaybillProductPopupComponent,
		EwaybillCommonInformationComponent,
		EwaybillAttachedDocumentsComponent,
		EwaybillCommonInformationComponent,
		EwaybillComponent,
		EwaybillConsigneeAcceptComponent,
		EwaybillEditTotalSumsComponent,
		EwaybillExtraFieldsReceiverComponent,
		EwaybillExtraInformationComponent,
		EwaybillInboxCanceledComponent,
		EwaybillInboxChangeRequiredComponent,
		EwaybillInboxCreatedComponent,
		EwaybillInboxCreatedCancelSentComponent,
		EwaybillMarksActsComponents,
		EwaybillOtherDetailsComponent,
		EwaybillOutboxReceivedComponent,
		EwaybillOutboxTransferredComponent,
		EwaybillPlacesShipmentDeliveryComponent,
		EwaybillProductPopupComponent,
		EwaybillProductsListComponent,
		EwaybillProductAdditionalFieldsComponent,
		EwaybillReceivedComponent,
		EwaybillInboxChangeRequiredNotConfirmComponent,
		EwaybillResponseDraftComponent,
		EwaybillResponseSignDraftComponent,
		EwaybillSignDraftComponent,
		EwaybillSendingComponent,
		EwaybillTransferredInboxComponent,
		EwaybillViewConfirmationComponent,
		EwaybillViewMainInfoComponent,
		EwaybillViewProductsComponent,
		EwaybillViewResponseInfoComponent,
		EwaybillOutboxCreatedComponent,
		EwaybillOutboxCanceledComponent,
		EwaybillOutboxChangeRequiredComponent,
		EwaybillOutboxCreatedConfirmedComponent,
		EwaybillOutboxNotConfirmedCancelComponent,
		EwaybillOutboxChangeRequiredNotConfirmComponent,
		EwaybillOutboxCreatedCancelSentComponent,
		EwaybillOutboxCreatedConfirmCancelSentComponent,
		EwaybillShipperInformationComponent,
		EwaybillReceiverInformationComponent,
		EwaybillFreightPayerInformationComponent,
		CurrentOrganizationEqualReceiverEqualShipperComponent,
		CurrentOrganizationEqualReceiverNotEqualShipperComponent,
		CurrentOrganizationEqualShipperNotEqualReceiverComponent,
		EwaybillDraftSignatureComponent,
		SharedEwaybillSignatureComponent,
		EwaybillCancelSignatureComponent,
		EwaybillStatisticViewComponent
	],
	entryComponents: [
		EwaybillProductPopupComponent,
		EwaybillEditTotalSumsComponent,
		EwaybillEditPopupComponent
	],
	providers: [
		{ provide: "NOT_CONFIRMED_CANCEL", useValue: (): string => "NOT_CONFIRMED_CANCEL" },
		{ provide: "CHANGE_REQUIRED_NOT_CONFIRMED", useValue: (): string => "CHANGE_REQUIRED_NOT_CONFIRMED" },
		{ provide: "CHANGE_REQUIRED", useValue: (): string => "CHANGE_REQUIRED" },
		{ provide: "CREATED_CANCEL_SEND", useValue: (): string => "CREATED_CANCEL_SEND" },
		{ provide: "CREATED_CONFIRMED_CANCEL_SEND", useValue: (): string => "CREATED_CONFIRMED_CANCEL_SEND" },
		{ provide: "CREATED_CONFIRMED", useValue: (): string => "CREATED_CONFIRMED" },
		{ provide: "CREATED", useValue: (): string => "CREATED" },
		EwaybillFormBuilderService,
		EwaybillResolverService,
		EwaybillSelectorService,
		EwaybillTransformService,
		OverlayService,
	]
})
export class EwaybillModule { }
