
import { NgModule } from "@angular/core";
import { RouterModule as AngularRouterModule, Routes } from "@angular/router";

import { AdminModule } from "../admin/admin.module";
import { TaxModule } from "../tax/tax.module";
import { UserModule } from "../user/user.module";

const appRoutes: Routes = [
	{
		path: "user",
		loadChildren: (): Promise<UserModule> => import("../user/user.module").then((e): UserModule => e.UserModule)
	},
	{
		path: "admin",
		loadChildren: (): Promise<AdminModule> => import("../admin/admin.module").then((e): AdminModule => e.AdminModule)
	},
	{
		path: "tax",
		loadChildren: (): Promise<TaxModule> => import("../tax/tax.module").then((e): TaxModule => e.TaxModule)
	},
	{
		path: "",
		redirectTo: "/user/documents",
		pathMatch: "full"
	}
];

@NgModule({
	exports: [AngularRouterModule],
	imports: [AngularRouterModule.forRoot(appRoutes)]
})
export class RouterModule { }
