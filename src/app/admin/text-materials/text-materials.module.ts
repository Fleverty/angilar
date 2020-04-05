import {NgModule} from "@angular/core";
import {TextMaterialsComponent} from "@app/admin/text-materials/text-materials.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {RouterModule, Routes} from "@angular/router";

const ROUTES: Routes = [
	{
		path: "",
		component: TextMaterialsComponent
	}
];

@NgModule({
	declarations: [
		TextMaterialsComponent
	],
	exports: [
		TextMaterialsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	]
})
export class TextMaterialsModule {

}
