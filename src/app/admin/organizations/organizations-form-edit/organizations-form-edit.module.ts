import {NgModule} from "@angular/core";
import {OrganizationsFormEditComponent} from "@app/admin/organizations/organizations-form-edit/organizations-form-edit.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {CommonComponent} from "@app/admin/organizations/organizations-form-edit/common/common.component";
import {ConnectionComponent} from "@app/admin/organizations/organizations-form-edit/connection/connection.component";
import {ConnectionGridComponent} from "@app/admin/organizations/organizations-form-edit/connection-grid/connection-grid.component";
import {PartnershipsComponent} from "@app/admin/organizations/organizations-form-edit/partnerships/partnerships.component";
import {PartnershipsGridComponent} from "@app/admin/organizations/organizations-form-edit/partnerships-grid/partnerships-grid.component";
import {RightsComponent} from "@app/admin/organizations/rights/rights.component";
import {StorageComponent} from "@app/admin/organizations/storage/storage.component";
import {AdditionalComponent} from "@app/admin/organizations/additional/additional.component";
import {ThirdPartiesComponent} from "@app/admin/organizations/organizations-form-edit/third-parties/third-parties.component";
import {NewConnectionPopupComponent} from "@app/admin/organizations/organizations-form-edit/new-connection-popup/new-connection-popup.component";
import {OverlayService} from "@core/overlay.service";

const ROUTES: Routes = [
	{
		path: "",
		component: OrganizationsFormEditComponent,
		children: [
			{
				path: "",
				component: CommonComponent
			},
			{
				path: "connection",
				component: ConnectionComponent
			},
			{
				path: "partnerships",
				component: PartnershipsComponent
			},
			{
				path: "rights",
				component: RightsComponent
			},
			{
				path: "storage",
				component: StorageComponent
			},
			{
				path: "additional",
				component: AdditionalComponent
			},
			{
				path: "third-parties",
				component: ThirdPartiesComponent
			}
		]
	}
];

@NgModule({
	declarations: [
		OrganizationsFormEditComponent,
		CommonComponent,
		ConnectionComponent,
		ConnectionGridComponent,
		PartnershipsComponent,
		PartnershipsGridComponent,
		RightsComponent,
		StorageComponent,
		AdditionalComponent,
		ThirdPartiesComponent,
		NewConnectionPopupComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	],
	providers: [
		OverlayService
	],
	entryComponents: [
		NewConnectionPopupComponent
	]
})
export class OrganizationsFormEditModule {

}
