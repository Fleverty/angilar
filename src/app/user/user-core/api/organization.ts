import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PartnersParams, PartnersDto } from "@helper/abstraction/partners";
import { Observable } from "rxjs";
import { StoragesParams, StoragesDto, TypedStoragesParams } from "@helper/abstraction/storages";
import { ConsigneesParams, ConsigneesDto } from "@helper/abstraction/consignee";
import { UnloadingPointsParams, UnloadingPointsDto } from "@helper/abstraction/unload-points";
import { LoadingPointsParams, LoadingPointsDto } from "@helper/abstraction/loading-points";
import { Organization as IOrganization, OrganizationDto } from "@helper/abstraction/organization";
import { map } from "rxjs/operators";

export class Organization {
	public partners = {
		list: {
			get$: (pp: PartnersParams): Observable<PartnersDto> => {
				const url = `${this.config.api.root}/organization/partners/list`;
				let params = new HttpParams();
				params = params.set("page", pp.page.toString());
				params = params.set("size", pp.size.toString());
				if (pp.searchText)
					params = params.set("partnerName", pp.searchText);
				return this.http.get<PartnersDto>(url, { params, withCredentials: true });
			}
		}
	};

	public buyers = {
		list: {
			get$: (pp: PartnersParams): Observable<PartnersDto> => {
				const url = `${this.config.api.root}/organization/buyers/list`;
				let params = new HttpParams();
				params = params.set("page", pp.page.toString());
				params = params.set("size", pp.size.toString());
				if (pp.documentTypeId)
					params = params.set("documentTypeId", pp.documentTypeId);
				if (pp.searchText)
					params = params.set("partnerName", pp.searchText);
				return this.http.get<PartnersDto>(url, { params, withCredentials: true });
			}
		}
	};

	public storages = {
		list: {
			get$: (sp: StoragesParams): Observable<StoragesDto> => {
				const url = `${this.config.api.root}/organization/storages/list`;
				let params = new HttpParams();
				params = params.set("page", sp.page.toString());
				params = params.set("size", sp.size.toString());
				if (sp.searchText)
					params = params.set("storageName", sp.searchText);
				return this.http.get<StoragesDto>(url, { params, withCredentials: true });
			},
			getByStorageType$: (sp: TypedStoragesParams): Observable<StoragesDto> => {
				const url = `${this.config.api.root}/organization/storages/${sp.storageTypeId}/list`;
				let params = new HttpParams();
				params = params.set("page", sp.page.toString());
				params = params.set("size", sp.size.toString());
				if (sp.documentTypeId)
					params = params.set("documentTypeId", sp.documentTypeId);
				if (sp.searchText)
					params = params.set("storageName", sp.searchText);
				if (sp.partnerId)
					params = params.set("partnerId", sp.partnerId.toString());
				return this.http.get<StoragesDto>(url, { params, withCredentials: true });
			},
			loadingPoints$: (lpp: LoadingPointsParams): Observable<LoadingPointsDto> => {
				const url = `${this.config.api.root}/organization/storages/loading-points/list`;
				let params = new HttpParams();
				params = params.set("page", lpp.page.toString());
				params = params.set("size", lpp.size.toString());
				if (lpp.searchText)
					params = params.set("storageName", lpp.searchText);
				return this.http.get<LoadingPointsDto>(url, { params, withCredentials: true });
			}
		},
	};

	public consignees = {
		list: {
			get$: (cp: ConsigneesParams): Observable<ConsigneesDto> => {
				const url = `${this.config.api.root}/organization/consignees/list`;
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
				const url = `${this.config.api.root}/organization/consignees/${upp.consigneeId}/storages/unloading-points/list`;
				let params = new HttpParams();
				params = params.set("page", upp.page.toString());
				params = params.set("size", upp.size.toString());
				params = params.set("documentTypeId", upp.documentTypeId.toString());

				if (upp.searchText) {
					params = params.set("consigneeName", upp.searchText);
				}

				return this.http.get<UnloadingPointsDto>(url, { params, withCredentials: true });
			}
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }

	public get$(): Observable<IOrganization> {
		const url = `${this.config.api.root}/organization`;
		return this.http.get<OrganizationDto>(url, { withCredentials: true }).pipe(
			map(data => {
				data.dateUpdate = new Date(data.dateUpdate);
				return data;
			}));
	}

	public post$(data: IOrganization): Observable<void> {
		const url = `${this.config.api.root}/organization`;
		return this.http.post<void>(url, data, { withCredentials: true });
	}
}
