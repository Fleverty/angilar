import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from "@angular/router";
import { StoreModule } from "@ngrx/store";

import { IdentityModule } from "./identity/identity.module";
import { LayoutModule } from "./layout/layout.module";
import { UserAuthGuard } from "./user-core/user-auth.guard";
import { UserLogoutGuard } from "./user-core/user-logout.guard";
import { UserCoreModule } from "./user-core/user-core.module";
import { UserComponent } from "./user.component";
import { reducer } from "./user.reducer";
import { EffectsModule } from "@ngrx/effects";
import { UserEffects } from "./user.effects";
import { SharedModule } from "@shared/shared.module";
import { TranslationComponent } from "./translation/translation.component";
import { TranslationService } from "@core/translation.service";
import { clearState } from "@app/app.reducer";
import { DownloadFileService } from "./documents/downloadFile.service";

export function matcher(urlSegment: UrlSegment[]): UrlMatchResult {
	return (urlSegment.length && (
		urlSegment[0].path === "login" ||
		urlSegment[0].path === "activation" ||
		urlSegment[0].path === "register" ||
		urlSegment[0].path === "restore")
		? { consumed: [] } : null) as any; // on angular docs you return null
}

export const ROUTES: Routes = [
	{
		path: "",
		component: UserComponent,
		children: [
			{
				path: "",
				canActivate: [UserAuthGuard],
				loadChildren: (): Promise<LayoutModule> => import("./layout/layout.module").then((e): LayoutModule => e.LayoutModule)
			},
			{
				path: "login",
				matcher,
				loadChildren: (): Promise<IdentityModule> => import("./identity/identity.module").then((e): IdentityModule => e.IdentityModule)
			},
			{
				path: "logout",
				canActivate: [UserLogoutGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		UserCoreModule,
		SharedModule,
		EffectsModule.forFeature([UserEffects]),
		StoreModule.forFeature("user", reducer, { metaReducers: [clearState] }),
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		UserComponent,
		TranslationComponent
	],
	entryComponents: [
		TranslationComponent
	],
	providers: [
		TranslationService,
		DownloadFileService,
		{ provide: "TranslateComponent", useValue: TranslationComponent },
	]
})
export class UserModule { }
