import {NgModule} from "@angular/core";
import {OrganizationsFormCreateComponent} from "@app/admin/organizations/organizations-form-create/organizations-form-create.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";

const ROUTES: Routes = [
	{
		path: "",
		component: OrganizationsFormCreateComponent
	}
];

@NgModule({
	declarations: [
		OrganizationsFormCreateComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class OrganizationsFormCreateModule {

}
