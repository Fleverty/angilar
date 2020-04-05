import { HttpClient } from "@angular/common/http";
import { Order as IOrder } from "@helper/abstraction/order";
import { ConfigurationService } from "@core/configuration.service";
import { DocumentController } from "./document-controller";
import { Observable } from "rxjs";
import { ShipmentNotification } from "@app/user/documents/shipment-notification/shipment-notification";
import { DocumentFromAnotherParams } from "@helper/abstraction/documents";
import { Ewaybill } from "@helper/abstraction/ewaybill";

export class Order extends DocumentController<IOrder> {
	public get apiUrl(): string { return `${this.config.api.order}`; }

	public convertToDraft = {
		DESADV: {
			post$: (orderId: number): Observable<ShipmentNotification> => {
				const url = `${this.apiUrl}/${orderId}/convertToDraftDesadv`;
				return this.http.post(url, {}, { withCredentials: true });
			}
		},
		EWAYBILL: {
			post$: (orderId: number, documentFromAnotherParams: DocumentFromAnotherParams): Observable<Ewaybill> => {
				const url = `${this.apiUrl}/${orderId}/convertToDraftEwaybill`;
				return this.http.post<Ewaybill>(url, documentFromAnotherParams, { withCredentials: true });
			}
		}
	};

	constructor(
		private config: ConfigurationService,
		http: HttpClient
	) {
		super(http);
	}
}
