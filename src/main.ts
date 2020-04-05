import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import * as runtime from "./runtime/constants";

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "production")
	enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);

if (!(window as any).appRuntime) {
	(window as any).appRuntime = runtime;
}
