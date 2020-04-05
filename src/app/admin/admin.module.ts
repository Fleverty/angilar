import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import {RouterModule, Routes} from "@angular/router";
import {LayoutModule} from "@app/admin/layout/layout.module";

export const ROUTES: Routes = [
	{
		path: "",
		component: AdminComponent,
		children: [
			{
				path: "",
				loadChildren: (): Promise<LayoutModule> => import("./layout/layout.module").then((e): LayoutModule => e.LayoutModule)
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [AdminComponent]
})
export class AdminModule { }
