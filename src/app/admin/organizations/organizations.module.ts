import {NgModule} from "@angular/core";
import {OrganizationsComponent} from "@app/admin/organizations/organizations.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {OrganizationsFormComponent} from "@app/admin/organizations/organizations-form/organizations-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {OrganizationsFormFilterComponent} from "@app/admin/organizations/organizations-form-filter/organizations-form-filter.component";
import {OrganizationsFormGridComponent} from "@app/admin/organizations/organizations-form-grid/organizations-form-grid.component";

const ROUTES: Routes = [
	{
		path: "",
		component: OrganizationsComponent
	}
];

@NgModule({
	declarations: [
		OrganizationsComponent,
		OrganizationsFormComponent,
		OrganizationsFormFilterComponent,
		OrganizationsFormGridComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		RouterModule.forChild(ROUTES)
	]
})
export class OrganizationsModule {

}
