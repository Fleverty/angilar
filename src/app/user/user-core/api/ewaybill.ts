import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ewaybill as IEwaybill } from "@helper/abstraction/ewaybill";
import { DocumentController } from "./document-controller";
import { DocumentFromAnotherParams, KindByMessageType, MassSendReport } from "@helper/abstraction/documents";
import { DraftType } from "@helper/abstraction/draft";

export class Ewaybill extends DocumentController<IEwaybill> {
	public get apiUrl(): string { return `${this.config.api.ewaybill}`; }

	public checkSign = {
		get$: (documentId: string): Observable<boolean> => {
			const url = `${this.apiUrl}/${documentId}/checkSign`;
			return this.http.get<boolean>(url, { withCredentials: true });
		}
	};

	public uniqueNumber = {
		get$: (): Observable<{ uniqueNumber: string }> => {
			const url = `${this.apiUrl}/uniqueNumber`;
			return this.http.get<{ uniqueNumber: string }>(url, { withCredentials: true });
		}
	};

	public saveSigned = {
		post$: (draftType: DraftType, documentDto: { id: string; xmlBody: string }): Observable<any> => {
			const url = `${this.config.api.root}/draft/saveSigned/${draftType}`;
			return this.http.post(url, documentDto, { withCredentials: true });
		}
	};

	public getDocumentFromAnother = {
		post$: <T extends DocumentFromAnotherParams>(body: T): Observable<KindByMessageType<T["destinationDocumentType"]>> => {
			const url = `${this.apiUrl}/${body.id}/getDocumentFromAnother`;
			return this.http.post<KindByMessageType<T["destinationDocumentType"]>>(url, body, { withCredentials: true });
		}
	};

	public sendMass = {
		post$: (ids: string[]): Observable<MassSendReport> => {
			const url = `${this.config.api.root}/sendEwaybillsByActiveMq`;
			return this.http.post<MassSendReport>(url, ids, { withCredentials: true });
		}
	};

	constructor(
		private config: ConfigurationService,
		http: HttpClient
	) {
		super(http);
	}
}
