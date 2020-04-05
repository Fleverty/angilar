import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ExportDocument } from "@helper/abstraction/documents";

export class FormatDocument {

	public create = {
		xlsx: {
			post$: (data: ExportDocument): Observable<void> => {
				const url = `${this.config.api.root}/web-service/format-document/create/xlsx`;
				return this.http.post<void>(url, data, { withCredentials: true });
			}
		},
		xml: {
			post$: (data: ExportDocument): Observable<void> => {
				const url = `${this.config.api.root}/web-service/format-document/create/xml`;
				return this.http.post<void>(url, data, { withCredentials: true });
			}
		}
	};

	constructor(
		private config: ConfigurationService,
		private http: HttpClient) { }
}
