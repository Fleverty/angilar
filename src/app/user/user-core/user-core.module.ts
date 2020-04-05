import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UserAuthGuard } from "./user-auth.guard";
import { UserAuthInterceptor } from "./user-auth.interceptor";
import { UserAuthService } from "./user-auth.service";
import { UserBackendService } from "./user-backend.service";
import { UserLogoutGuard } from "./user-logout.guard";
import { UserLogoutInterceptor } from "./user-logout.interceptor";
import { UserPermissionService } from "./user-permission.service";
import { HttpDocumentNotFoundInterceptor } from "@app/user/user-core/http-document-not-found.interceptor";
import { UserErrorInterceptor } from "./user-error.interceptor";
import { UserErrorsService } from "./user-errors.service";
import { UserFilterService } from "./user-filter.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@NgModule({
	imports: [
		HttpClientModule
	],
	providers: [
		UserAuthService,
		UserErrorsService,
		UserAuthGuard,
		UserLogoutGuard,
		UserBackendService,
		UserPermissionService,
		UserFilterService,
		UserRoutingService,
		{ provide: HTTP_INTERCEPTORS, useClass: UserAuthInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: UserLogoutInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpDocumentNotFoundInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: UserErrorInterceptor, multi: true },
		{ provide: "itemsToStore", useValue: 5 }
	],
	declarations: []
})
export class UserCoreModule { }
