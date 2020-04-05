import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@shared/shared.module";

import { IdentityComponent } from "./identity.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RestoreComponent } from "./restore/restore.component";
import { RecoverComponent } from "./recover/recover.component";

export const ROUTES: Routes = [
	{
		path: "restore",
		component: RestoreComponent
	},
	{
		path: "",
		component: IdentityComponent,
		children: [
			{
				path: "login",
				component: LoginComponent
			},
			{
				path: "register",
				component: RegisterComponent
			},
			{
				path: "activation",
				component: RecoverComponent
			},
			{
				path: "",
				redirectTo: "login"
			}
		]
	}
];
@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		IdentityComponent,
		LoginComponent,
		RegisterComponent,
		RestoreComponent,
		RecoverComponent
	]
})
export class IdentityModule { }
