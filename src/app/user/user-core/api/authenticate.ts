import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { AuthenticateResponce } from "@helper/abstraction/authenticate";
import { Role } from "@helper/abstraction/roles";

export class Authentication {
	public authenticate = {
		post$: (username: string, password: string): Observable<AuthenticateResponce> => {
			const url = `${this.config.api.root}/authentication/authenticate`;
			return this.http.post<AuthenticateResponce>(url, { username, password });
		}
	};

	public roles = {
		list: {
			get$: (): Observable<Role[]> => {
				const url = `${this.config.api.root}/authentication/roles/list`;
				return this.http.get<Role[]>(url, { withCredentials: true });
			}
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
