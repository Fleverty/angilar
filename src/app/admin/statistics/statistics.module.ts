import {NgModule} from "@angular/core";
import {StatisticsComponent} from "@app/admin/statistics/statistics.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";

const ROUTES: Routes = [
	{
		path: "",
		component: StatisticsComponent
	}
];

@NgModule({
	declarations: [
		StatisticsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class StatisticsModule {

}
