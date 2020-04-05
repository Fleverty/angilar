import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class Config {

	public rememberLogin = {
		get$: (): Observable<boolean> => {
			const url = `${this.config.api.root}/config/rememberLogin`;
			return this.http.get<boolean>(url);
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
