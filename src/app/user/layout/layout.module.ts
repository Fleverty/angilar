import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@shared/shared.module";

import { CustomizationModule } from "../customization/customization.module";
import { DocumentsModule } from "../documents/documents.module";
import { StatisticsModule } from "../statistics/statistics.module";
import { HeaderComponent } from "./header/header.component";
import { LayoutComponent } from "./layout.component";

export const ROUTES: Routes = [
	{
		path: "",
		component: LayoutComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "/documents"
			},
			{
				path: "documents",
				loadChildren: (): Promise<DocumentsModule> => import("../documents/documents.module").then((e): DocumentsModule => e.DocumentsModule)
			},
			{
				path: "customization",
				loadChildren: (): Promise<CustomizationModule> => import("../customization/customization.module").then((e): CustomizationModule => e.CustomizationModule)
			},
			{
				path: "statistics",
				loadChildren: (): Promise<StatisticsModule> => import("../statistics/statistics.module").then((e): StatisticsModule => e.StatisticsModule)
			},
		]
	}
];
@NgModule({
	declarations: [
		HeaderComponent,
		LayoutComponent
	],
	exports: [
		HeaderComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CustomizationModule,
		RouterModule.forChild(ROUTES)
	]
})
export class LayoutModule { }
