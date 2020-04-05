import { Observable } from "rxjs";
import { first, map, switchAll } from "rxjs/operators";

import {
	HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { UserAuthService } from "./user-auth.service";

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
	constructor(private readonly authService: UserAuthService) { }

	public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (!httpRequest.withCredentials)
			return next.handle(httpRequest);

		return this.authService.token$.pipe(
			first(),
			map(token => {
				if (token)
					httpRequest = httpRequest.clone({
						headers: httpRequest.headers.set("Authorization", token)
					});
				return next.handle(httpRequest);
			}),
			switchAll()
		);
	}
}
