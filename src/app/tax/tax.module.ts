import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaxComponent } from "./tax.component";
import { Routes, RouterModule } from "@angular/router";

export const ROUTES: Routes = [
	{
		path: "",
		pathMatch: "full",
		component: TaxComponent
	}
];
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [TaxComponent]
})
export class TaxModule { }
