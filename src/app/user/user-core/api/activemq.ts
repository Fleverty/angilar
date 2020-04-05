import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { DraftType } from "@helper/abstraction/draft";
import { Observable } from "rxjs";

export class Activemq {
	public send = {
		get$: (draftId: string, draftType: DraftType): Observable<any> => {
			const url = `${this.config.api.root}/activemq/send/${draftType}/${draftId}`;
			return this.http.get<any>(url, { withCredentials: true });
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
