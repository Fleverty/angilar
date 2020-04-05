import {NgModule} from "@angular/core";
import {HandbooksComponent} from "@app/admin/handbooks/handbooks.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";

const ROUTES: Routes = [
	{
		path: "",
		component: HandbooksComponent
	}
];

@NgModule({
	declarations: [
		HandbooksComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class HandbooksModule {

}
