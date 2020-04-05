import { ConsigneesParams, ConsigneesDto } from "@helper/abstraction/consignee";
import { Observable } from "rxjs";
import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UnloadingPointsParams, UnloadingPointsDto } from "@helper/abstraction/unload-points";

export class Consignees {
	public list = {
		get$: (cp: ConsigneesParams): Observable<ConsigneesDto> => {
			const url = `${this.config.api.root}/consignees/list`;
			let params = new HttpParams();
			params = params.set("documentTypeId", cp.documentTypeId);
			params = params.set("page", cp.page.toString());
			params = params.set("size", cp.size.toString());

			if (cp.searchText) {
				params = params.set("consigneeName", cp.searchText);
			}

			return this.http.get<ConsigneesDto>(url, { params, withCredentials: true });
		},

		unloadingPoints$: (upp: UnloadingPointsParams): Observable<UnloadingPointsDto> => {
			const url = `${this.config.api.root}/consignees/${upp.consigneeId}/storages/unloading-points/list`;
			let params = new HttpParams();
			params = params.set("page", upp.page.toString());
			params = params.set("size", upp.size.toString());

			if (upp.searchText) {
				params = params.set("consigneeName", upp.searchText);
			}

			return this.http.get<UnloadingPointsDto>(url, { params, withCredentials: true });
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
