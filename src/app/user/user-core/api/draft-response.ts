import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EwaybillReceived, ResponseDraftInfo } from "@helper/abstraction/ewaybill";
import { MessageType } from "@helper/abstraction/documents";

export class DraftResponse {
	public saveBasedOnEwaybill = {
		BLRWBR: {
			post$: (ewaybillId: string): Observable<ResponseDraftInfo> => {
				const url = `${this.config.api.root}/draft/response/saveBasedOnEwaybillBLRWBR/${ewaybillId}`;
				return this.http.post<ResponseDraftInfo>(url, null, { withCredentials: true });
			}
		},
		BLRDNR: {
			post$: (ewaybillId: string): Observable<ResponseDraftInfo> => {
				const url = `${this.config.api.root}/draft/response/saveBasedOnEwaybillBLRDNR/${ewaybillId}`;
				return this.http.post<ResponseDraftInfo>(url, null, { withCredentials: true });
			}
		}
	};

	public find = {
		get$: (commonDocumentType: string, responseId: string): Observable<EwaybillReceived> => {
			const url = `${this.config.api.root}/draft/response/find/${commonDocumentType}/${responseId}`;
			return this.http.get<EwaybillReceived>(url, { withCredentials: true });
		}
	};

	public findXml = {
		get$: (commonDocumentType: MessageType, responseId: number): Observable<{ id: number; xmlBody: string }> => {
			const url = `${this.config.api.root}/draft/response/findXml/${commonDocumentType}/${responseId}`;
			return this.http.get<{ id: number; xmlBody: string }>(url, { withCredentials: true });
		}
	};

	public saveBasedOnOrderORDRSP = {
		post$: (orderId: number): Observable<ResponseDraftInfo> => {
			const url = `${this.config.api.root}/draft/response/saveBasedOnOrderORDRSP/${orderId}`;
			return this.http.post<ResponseDraftInfo>(url, undefined, { withCredentials: true });
		}
	};

	public validateAndSaveSignedResponse = {
		post$: (messageType: MessageType, draftResponseXml: { id: number; xmlBody: string }): Observable<any> => {
			const url = `${this.config.api.root}/draft/response/validateAndSaveSignedResponse/${messageType}`;
			return this.http.post<any>(url, draftResponseXml, { withCredentials: true });
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
