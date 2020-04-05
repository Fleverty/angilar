import { NgModule } from "@angular/core";

import { ConfigurationService } from "./configuration.service";
import { OverlayService } from "./overlay.service";
import { PermissionService } from "./permission.service";
import { BackendService } from "./backend.service";
import { VersionCheckService } from "./version-check.service";
import { HttpClientModule } from "@angular/common/http";
import { TranslationService } from "./translation.service";
import { ConstantsComponent } from "./constants.component";

export function windowFactory(): Window {
	return window;
}
@NgModule({
	declarations: [
		ConstantsComponent
	],
	entryComponents: [
		ConstantsComponent
	],
	imports: [
		HttpClientModule
	],
	providers: [
		ConfigurationService,
		PermissionService,
		OverlayService,
		BackendService,
		VersionCheckService,
		TranslationService,
		{ provide: "Window", useValue: windowFactory() },
		{ provide: "TranslateComponent", useValue: ConstantsComponent },
	]
})
export class CoreModule { }
