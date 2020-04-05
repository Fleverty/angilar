import { EffectsModule } from "@ngrx/effects";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { SharedModule } from "@shared/shared.module";

import { DocumentActionComponent } from "./document-action/document-action.component";
import { DocumentAddPopupComponent } from "./document-add-popup/document-add-popup.component";
import { DocumentFilterComponent } from "./document-filter/document-filter.component";
import { DocumentListComponent } from "./document-list/document-list.component";
import { EwaybillCreatePopupComponent } from "./ewaybill-create-popup/ewaybill-create-popup.component";
import { DocumentTypeListComponent } from "./document-type-list/document-type-list.component";
import { DocumentTypeComponent } from "./document-type/document-type.component";
import { DocumentsComponent } from "./documents.component";
import { DocumentsEffects } from "./documents.effects";
import { reducer } from "./documents.reducer";
import { StoreModule } from "@ngrx/store";
import { EwaybillActionComponent } from "./ewaybill-action/ewaybill-action.component";
import { DocumentParamsService } from "./document-params.service";
import { OrderActionComponent } from "./order-action/order-action.component";
import { OrderCreatePopupComponent } from "./order-create-popup/order-create-popup.component";
import { ShipmentNotificationActionComponent } from "@app/user/documents/shipment-notification-action/shipment-notification-action.component";
import { ShipmentNotificationModule } from "@app/user/documents/shipment-notification/shipment-notification.module";
import { DraftEffects } from "@app/user/documents/draft.effects";
import { EwaybillModule } from "@app/user/documents/ewaybill/ewaybill.module";
import { OrderModule } from "@app/user/documents/order/order.module";
import { DocumentNotFoundComponent } from "./document-not-found/document-not-found.component";
import { EwaybillSharedCreatePopupComponent } from "@app/user/documents/ewaybill-create-popup/ewaybill-shared-create-popup.component";
import { EinvoiceActionComponent } from "./einvoice-action/einvoice-action.component";
import { EinvoiceModule } from "./einvoice/einvoice.module";
import { documentState } from "@helper/paths";
import { EinvoicepmtActionComponent } from "@app/user/documents/einvoicepmt-action/einvoicepmt-action.component";
import { EinvoicepmtModule } from "@app/user/documents/einvoicepmt/einvoicepmt.module";
import { EwaybillMassSendPopupComponent } from "./ewaybill/ewaybill-mass-send/ewaybill-mass-send-popup/ewaybill-mass-send-popup.component";
import { EwaybillMassSendReportPopupComponent } from "./ewaybill/ewaybill-mass-send/ewaybill-mass-send-report-popup/ewaybill-mass-send-report-popup.component";
import { ImportPopupComponent } from "./import-popup/import-popup.component";

export function matcher(urlSegment: UrlSegment[]): UrlMatchResult {
	return urlSegment.length && ((urlSegment[1] && [documentState.incoming, documentState.outgoing, documentState.draft as string].indexOf(urlSegment[1].path) !== -1) || !urlSegment[1]) ? {
		consumed: [new UrlSegment(urlSegment[0].path, {})],
		posParams: { "documentTypeId": urlSegment[0] }
	} : null as any;
}

export const ROUTES: Routes = [
	{
		path: "not-found",
		component: DocumentNotFoundComponent
	},
	{
		path: "",
		component: DocumentsComponent,
		children: [
			{
				component: DocumentActionComponent,
				path: ":documentTypeId",
				matcher,
				children: [
					{
						path: "",
						pathMatch: "full",
						redirectTo: documentState.incoming
					},
					{
						path: ":actionTypeKey",
						component: DocumentListComponent,
					}
				],
			},
		],
	},
	{
		path: "DESADV",
		loadChildren: (): Promise<ShipmentNotificationModule> => import("./shipment-notification/shipment-notification.module").then((e): ShipmentNotificationModule => e.ShipmentNotificationModule)
	},
	{
		path: "EWAYBILL",
		loadChildren: (): Promise<EwaybillModule> => import("./ewaybill/ewaybill.module").then((e): EwaybillModule => e.EwaybillModule)
	},
	{
		path: "ORDERS",
		loadChildren: (): Promise<OrderModule> => import("./order/order.module").then((e): OrderModule => e.OrderModule)
	},
	{
		path: "EINVOICE",
		loadChildren: (): Promise<EinvoiceModule> => import("./einvoice/einvoice.module").then((e): EinvoiceModule => e.EinvoiceModule)
	},
	{
		path: "EINVOICEPMT",
		loadChildren: (): Promise<EinvoicepmtModule> => import("./einvoicepmt/einvoicepmt.module").then((e): EinvoicepmtModule => e.EinvoicepmtModule)
	}
];

@NgModule({
	declarations: [
		ImportPopupComponent,
		DocumentActionComponent,
		DocumentAddPopupComponent,
		DocumentFilterComponent,
		DocumentListComponent,
		DocumentsComponent,
		DocumentTypeComponent,
		DocumentTypeListComponent,
		DocumentAddPopupComponent,
		EwaybillCreatePopupComponent,
		EwaybillSharedCreatePopupComponent,
		EwaybillActionComponent,
		OrderActionComponent,
		OrderCreatePopupComponent,
		ShipmentNotificationActionComponent,
		DocumentNotFoundComponent,
		EinvoiceActionComponent,
		EinvoicepmtActionComponent,
		EwaybillMassSendPopupComponent,
		EwaybillMassSendReportPopupComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		EffectsModule.forFeature([DocumentsEffects]),
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES),
		StoreModule.forFeature("documents", reducer),
	],
	entryComponents: [
		ImportPopupComponent,
		DocumentAddPopupComponent,
		EwaybillCreatePopupComponent,
		OrderCreatePopupComponent,
		EwaybillSharedCreatePopupComponent,
		EwaybillMassSendPopupComponent,
		EwaybillMassSendReportPopupComponent
	],
	providers: [
		DocumentParamsService,
		OverlayService,
		DraftEffects
	]
})
export class DocumentsModule {
}
