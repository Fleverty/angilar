import {RouterModule, Routes} from "@angular/router";
import {UsersComponent} from "@app/admin/users/users.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";

const ROUTES: Routes = [
	{
		path: "",
		component: UsersComponent
	}
];

@NgModule({
	declarations: [
		UsersComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class UsersModule {

}
