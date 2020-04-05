import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { NewInboxDocumentsCountDto } from "@helper/abstraction/documents";
import { StatisticEwaybillParams, StatisticEwaybillDto, StatisticRequestFilterParams, ShipperDto, DeliveryPlaceFilter, DeliveryPointStatistic, StatisticOrderParams, StatisticOrdersDto } from "@helper/abstraction/statistic";

export class Statistic {

	public messagesCount = {
		get$: (): Observable<NewInboxDocumentsCountDto> => {
			const url = `${this.config.api.root}/statistic/messagesCount`;

			return this.http.get<NewInboxDocumentsCountDto>(url, { withCredentials: true });
		}
	};

	public findEwaybillByFilter = {
		post$: (statisticParams: StatisticEwaybillParams): Observable<StatisticEwaybillDto> => {
			const url = `${this.config.api.root}/statistic/findEwaybillByFilter`;
			const { page, size, ...filterDto } = statisticParams;
			let params = new HttpParams();
			params = params.set("page", page.toString());
			params = params.set("size", size.toString());
			return this.http.post<StatisticEwaybillDto>(url, filterDto, { params, withCredentials: true });
		}
	};

	public findOrdersStatisticByFilter = {
		post$: (statisticOrdersParams: StatisticOrderParams): Observable<StatisticOrdersDto> => {
			const url = `${this.config.api.root}/statistic/findOrdersStatisticByFilter`;
			const { page, size, ...filterDto } = statisticOrdersParams;
			let params = new HttpParams();
			params = params.set("page", page.toString());
			params = params.set("size", size.toString());
			return this.http.post<StatisticOrdersDto>(url, filterDto, { params, withCredentials: true });
		}
	};

	public valuesStatistic = {
		post$: (statisticRequestFilterParams: StatisticRequestFilterParams): Observable<ShipperDto> => {
			const url = `${this.config.api.root}/statistic/valuesStatistic`;
			statisticRequestFilterParams = {
				...statisticRequestFilterParams,
				keyWord: statisticRequestFilterParams.searchText || ""
			};
			const { page, size, ...statisticValuesDto } = statisticRequestFilterParams;
			let params = new HttpParams();
			params = params.set("page", page.toString());
			params = params.set("size", size.toString());
			return this.http.post<ShipperDto>(url, statisticValuesDto, { params, withCredentials: true });
		}
	};


	public findActiveStorageAndNsiGeneralGlnByCondition = {
		get$: (deliveryPlaceFilter: DeliveryPlaceFilter): Observable<DeliveryPointStatistic[]> => {
			const url = `${this.config.api.root}/statistic/findActiveStorageAndNsiGeneralGlnByCondition`;
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
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
