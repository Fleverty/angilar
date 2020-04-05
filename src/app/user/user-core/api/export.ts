import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { DocumentType } from "@helper/abstraction/documents";
import { Observable } from "rxjs";
import { StatisticEwaybillParams, DeliveryPlaceFilter, DeliveryPointStatistic, StatisticOrderParams } from "@helper/abstraction/statistic";

export class Export {

	public createFormatDocument = {
		post$: (id: number[], msgTypeForGenerator: DocumentType): Observable<HttpResponse<Blob>> => {
			const url = `${this.config.api.root}/export/createFormatDocuments`;
			return this.http.post<Blob>(url, { id, msgTypeForGenerator }, {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				withCredentials: true,
				responseType: "blob" as "json",
				observe: "response"
			});
		}
	};

	public сreateRegistry = {
		post$: (id: string): Observable<HttpResponse<Blob>> => {
			const url = `${this.config.api.root}/export/createRegistry`;
			return this.http.post<Blob>(url, { id }, {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				withCredentials: true,
				responseType: "blob" as "json",
				observe: "response"
			});
		}
	};

	public ewaybillList = {
		post$: (statisticEwaybillParams: StatisticEwaybillParams, outputType: "PDF" | "RTF" | "XLS" | "DOCX" | "XLSX" | "XML"): Observable<HttpResponse<Blob>> => {
			const url = `${this.config.api.root}/export/ewaybillList/${outputType}`;
			const body = { ...statisticEwaybillParams, page: { page: statisticEwaybillParams.page, size: statisticEwaybillParams.size } };

			return this.http.post<Blob>(url, body, {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				withCredentials: true,
				responseType: "blob" as "json",
				observe: "response"
			});
		}
	};

	public storageAndNsiGeneralGln = {
		findAllActiveByCondition: {
			get$: (deliveryPlaceFilter: DeliveryPlaceFilter): Observable<DeliveryPointStatistic[]> => {
				const url = `${this.config.api.root}/storageAndNsiGeneralGln/findAllActiveByCondition`;
				let params = new HttpParams();
				params = params.set("page", deliveryPlaceFilter.page.toString());
				params = params.set("size", deliveryPlaceFilter.size.toString());
				if (deliveryPlaceFilter.relatedPartyId.length) {
					params = params.set("relatedPartyId", deliveryPlaceFilter.relatedPartyId.toString());
				}
				if (deliveryPlaceFilter.storageAddressFull) {
					params = params.set("storageAddressFull", deliveryPlaceFilter.storageAddressFull);
				}
				if (deliveryPlaceFilter.storageGln) {
					params = params.set("storageGln", deliveryPlaceFilter.storageGln);
				}
				return this.http.get<DeliveryPointStatistic[]>(url, { params, withCredentials: true });
			}
		}
	};

	public statisticOrdersWithRelations = {
		post$: (statisticOrderParams: StatisticOrderParams): Observable<HttpResponse<Blob>> => {
			const url = `${this.config.api.root}/export/statisticOrdersWithRelations`;
			const body = { ...statisticOrderParams, page: { page: statisticOrderParams.page, size: statisticOrderParams.size } };

			return this.http.post<Blob>(url, body, {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				withCredentials: true,
				responseType: "blob" as "json",
				observe: "response"
			});
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
