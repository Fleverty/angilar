import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { Observable } from "rxjs";
import { SectionList } from "@helper/abstraction/sections";

export class Sections {
	public help = {
		data: {
			get$: (): Observable<SectionList[]> => {
				const url = `${this.config.api.root}/section/help/data`;
				return this.http.get<SectionList[]>(url, { withCredentials: true });
			}
		},
		page: {
			content: {
				get$: (id: number): Observable<string> => {
					const url = `${this.config.api.root}/section/help/page/content/${id}`;
					return this.http.get<string>(url, { withCredentials: true });
				}
			}
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
