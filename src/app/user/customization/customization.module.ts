import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CustomizationComponent } from "./customization.component";
import { ProfileComponent } from "./profile/profile.component";
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ProfileChangePasswordComponent } from "./profile/profile-change-password/profile-change-password.component";
import { MyOrganizationComponent } from "./my-organization/my-organization.component";
import { OrganizationComponent } from "./my-organization/organization/organization.component";
import { Routes, RouterModule } from "@angular/router";
import { PartnersComponent } from "./my-organization/partners/partners.component";
import { StoragesComponent } from "./my-organization/storages/storages.component";
import { HelpComponent } from "./help/help.component";
import { MarkdownModule } from "ngx-markdown";
import { HelpContentComponent } from "./help/help-content/help-content.component";
import { CustomizationResolver } from "./customization.resolver";
import { StoreModule } from "@ngrx/store";
import { reducer } from "./customization.reducer";
import { EffectsModule } from "@ngrx/effects";
import { CustomizationEffects } from "./customization.effects";
import { OverlayService } from "@core/overlay.service";
import { StoragesGridComponent } from "@app/user/customization/my-organization/storages-grid/storages-grid.component";
import { CustomizationErrorService } from "./customization.service";
import { PartnersGridComponent } from "./my-organization/partners-grid/partners-grid.component";
import { StorageCreatePopupComponent } from "./my-organization/storage-create-popup/storage-create-popup.component";
import { HelpTreeComponent } from "./help/help-tree/help-tree.component";
import { CustomizationSelectorService } from "./customization-selector.service";
import { CustomizationFilterService } from "./customization-filter.service";

export const ROUTES: Routes = [
	{
		path: "",
		component: CustomizationComponent,
		children: [
			{
				path: "", pathMatch: "full", redirectTo: "/user/customization/profile"
			},
			{
				component: ProfileComponent,
				path: "profile"
			},
			{
				component: MyOrganizationComponent,
				path: "organization",
				children: [
					{
						component: OrganizationComponent,
						path: ""
					},
					{
						component: StoragesComponent,
						path: "storages"
					},
					{
						component: PartnersComponent,
						path: "partners"
					}
				]
			},
			{
				component: HelpComponent,
				path: "help",
				children: [
					{
						component: HelpContentComponent,
						path: ":id",
						resolve: { message: CustomizationResolver }
					}
				]
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		RouterModule.forChild(ROUTES),
		MarkdownModule.forRoot(),
		EffectsModule.forFeature([CustomizationEffects]),
		StoreModule.forFeature("customization", reducer),
	],
	declarations: [
		StorageCreatePopupComponent,
		HelpComponent,
		HelpContentComponent,
		HelpTreeComponent,
		ProfileComponent,
		CustomizationComponent,
		ProfileChangePasswordComponent,
		MyOrganizationComponent,
		OrganizationComponent,
		PartnersComponent,
		PartnersGridComponent,
		StoragesComponent,
		StoragesGridComponent
	],
	providers: [
		CustomizationErrorService,
		CustomizationResolver,
		OverlayService,
		CustomizationSelectorService,
		CustomizationFilterService
	],
	entryComponents: [
		ProfileChangePasswordComponent,
		StorageCreatePopupComponent
	],
})
export class CustomizationModule { }
