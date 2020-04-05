import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OperationsConfirmByProvider, ProviderConfirmation } from "@helper/abstraction/operations-confirm";

export class Provider {

	public provider = {
		EWAYBILL: {
			get$: (id: string): Observable<OperationsConfirmByProvider> => {
				const url = `${this.config.api.root}/provider/EWAYBILL/${id}`;
				return this.http.get<OperationsConfirmByProvider>(url, { withCredentials: true });
			}
		},

		EINVOICE: {
			get$: (id: string): Observable<ProviderConfirmation> => {
				const url = `${this.config.api.root}/provider/EINVOICE/${id}`;
				return this.http.get<ProviderConfirmation>(url, { withCredentials: true });
			}
		},

		EINVOICEPMT: {
			get$: (id: string): Observable<ProviderConfirmation> => {
				const url = `${this.config.api.root}/provider/EINVOICEPMT/${id}`;
				return this.http.get<ProviderConfirmation>(url, { withCredentials: true });
			}
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
