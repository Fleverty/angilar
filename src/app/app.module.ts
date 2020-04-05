import { registerLocaleData } from "@angular/common";
import localeRuBy from "@angular/common/locales/ru-BY";
import { LOCALE_ID, NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from "./core/core.module";
import { RouterModule as AppRouterModule } from "./router/router.module";
import { SharedModule } from "./shared/shared.module";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

registerLocaleData(localeRuBy, "ru-By");

@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent],
	imports: [
		AppRouterModule,
		BrowserModule,
		CoreModule,
		SharedModule,
		EffectsModule.forRoot([]),
		StoreModule.forRoot({}, {
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictStateSerializability: false,
				strictActionSerializability: false,
			}
		}),
		StoreDevtoolsModule.instrument({ maxAge: 25 }),
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "ru-By" },
	]
})
export class AppModule { }
