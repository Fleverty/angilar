import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import {
	HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class UserLogoutInterceptor implements HttpInterceptor {
	constructor(private readonly router: Router) { }

	public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const result$ = next.handle(httpRequest);
		return this.router.url === "/user/login" ? result$ : result$.pipe(catchError((error: HttpErrorResponse) => {
			if (error.status === 401)
				this.router.navigateByUrl("user/logout");
			return throwError(error);
		}));
	}
}
