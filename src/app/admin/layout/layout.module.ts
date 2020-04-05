import {NgModule} from "@angular/core";
import {NavigationComponent} from "@app/admin/layout/navigation/navigation.component";
import {LayoutComponent} from "@app/admin/layout/layout.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {HeaderComponent} from "@app/admin/layout/header/header.component";
import {AdministrationModule} from "@app/admin/administration/administration.module";
import {HandbooksModule} from "@app/admin/handbooks/handbooks.module";
import {OrganizationsModule} from "@app/admin/organizations/organizations.module";
import {SettingsModule} from "@app/admin/settings/settings.module";
import {StatisticsModule} from "@app/admin/statistics/statistics.module";
import {TextMaterialsModule} from "@app/admin/text-materials/text-materials.module";
import {UsersModule} from "@app/admin/users/users.module";
import {OrganizationsFormCreateModule} from "@app/admin/organizations/organizations-form-create/organizations-form-create.module";
import {OrganizationsFormEditModule} from "@app/admin/organizations/organizations-form-edit/organizations-form-edit.module";

export const ROUTES: Routes = [
	{
		path: "",
		component: LayoutComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "/admin/organizations"
			},
			{
				path: "administration",
				loadChildren: (): Promise<AdministrationModule> => import("../administration/administration.module").then((e): AdministrationModule => e.AdministrationModule)
			},
			{
				path: "handbooks",
				loadChildren: (): Promise<HandbooksModule> => import("../handbooks/handbooks.module").then((e): HandbooksModule => e.HandbooksModule)
			},
			{
				path: "organizations",
				loadChildren: (): Promise<OrganizationsModule> => import("../organizations/organizations.module").then((e): OrganizationsModule => e.OrganizationsModule)
			},
			{
				path: "settings",
				loadChildren: (): Promise<SettingsModule> => import("../settings/settings.module").then((e): SettingsModule => e.SettingsModule)
			},
			{
				path: "statistics",
				loadChildren: (): Promise<StatisticsModule> => import("../statistics/statistics.module").then((e): StatisticsModule => e.StatisticsModule)
			},
			{
				path: "materials",
				loadChildren: (): Promise<TextMaterialsModule> => import("../text-materials/text-materials.module").then((e): TextMaterialsModule => e.TextMaterialsModule)
			},
			{
				path: "users",
				loadChildren: (): Promise<UsersModule> => import("../users/users.module").then((e): UsersModule => e.UsersModule)
			}
		]
	},
	{
		path: "organizations/create",
		loadChildren: (): Promise<OrganizationsFormCreateModule> => import("../organizations/organizations-form-create/organizations-form-create.module").then((e): OrganizationsFormCreateModule => e.OrganizationsFormCreateModule)
	},
	{
		path: "organizations/edit/:id",
		loadChildren: (): Promise<OrganizationsFormEditModule> => import("../organizations/organizations-form-edit/organizations-form-edit.module").then((e): OrganizationsFormEditModule => e.OrganizationsFormEditModule)
	}
];

@NgModule({
	declarations: [
		NavigationComponent,
		HeaderComponent,
		LayoutComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class LayoutModule { }
