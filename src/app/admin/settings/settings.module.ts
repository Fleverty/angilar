import {NgModule} from "@angular/core";
import {SettingsComponent} from "@app/admin/settings/settings.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";

const ROUTES: Routes = [
	{
		path: "",
		component: SettingsComponent
	}
];

@NgModule({
	declarations: [
		SettingsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class SettingsModule {

}
