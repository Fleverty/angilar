import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Einvoice as IEinvoice } from "@helper/abstraction/einvoice";
import { DocumentController } from "./document-controller";
import { Observable } from "rxjs";
import { DraftDto } from "@helper/abstraction/draft";

export class Einvoice extends DocumentController<IEinvoice> {
	public get apiUrl(): string { return `${this.config.api.einvoice}`; }

	public getEinvoiceResponse = {
		get$: (documentId: number): Observable<DraftDto> => {
			const url = `${this.apiUrl}/${documentId}/response`;
			return this.http.get<DraftDto>(url, { withCredentials: true });
		}
	};

	public saveSignedResponse = {
		post$: (documentDto: { id: string; xmlBody: string }): Observable<any> => {
			const url = `${this.apiUrl}/saveSignedResponse`;
			return this.http.post(url, documentDto, { withCredentials: true });
		}
	};

	public cancelEinvoice = {
		get$: (documentId: string): Observable<DraftDto> => {
			const url = `${this.apiUrl}/${documentId}/cancel`;
			return this.http.get<DraftDto>(url, { withCredentials: true });
		}
	};

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

	constructor(
		private config: ConfigurationService,
		http: HttpClient
	) {
		super(http);
	}

	public delete(draftIds: number[]): Observable<number> {
		const url = `${this.apiUrl}/draft/delete`;
		const options = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
			}),
			body: draftIds,
			withCredentials: true
		};
		return this.http.delete<number>(url, options);
	}
}
