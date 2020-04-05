import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";

@Injectable()
export class UserErrorInterceptor implements HttpInterceptor {
	constructor(private readonly overlayService: OverlayService) { }

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.error && error.error.errorCode == "EX1001") {
					this.overlayService.showNotification$(error.error.error, "error");
				}
				return throwError(error);
			})
		);
	}
}
