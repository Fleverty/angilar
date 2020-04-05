import {NgModule} from "@angular/core";
import {AdministrationComponent} from "@app/admin/administration/administration.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";

const ROUTES: Routes = [
	{
		path: "",
		pathMatch: "full",
		component: AdministrationComponent
	}
];

@NgModule({
	declarations: [
		AdministrationComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class AdministrationModule {

}
