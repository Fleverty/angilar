import { Injectable } from "@angular/core";
import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ConfigurationService } from "@core/configuration.service";

@Injectable()
export class HttpDocumentNotFoundInterceptor implements HttpInterceptor {
	constructor(private readonly router: Router, private readonly configService: ConfigurationService) { }
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError(error => {
				const documentsApiPaths = [this.configService.api.desadv, this.configService.api.einvoice, this.configService.api.order, this.configService.api.ewaybill, `${this.configService.api.root}/draft`];
				const isDocumentsApi = documentsApiPaths.some(e => error.url.includes(e));
				if (error instanceof HttpErrorResponse) {
					if (error.status === 404 && isDocumentsApi) {
						this.router.navigateByUrl("user/documents/not-found");
					}
				}
				return throwError(error);
			})
		);
	}
}
