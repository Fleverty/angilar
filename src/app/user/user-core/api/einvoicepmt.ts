import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { EinvoicepmtDto as IEinvoicepmt } from "@helper/abstraction/einvoicepmt";
import { DocumentController } from "./document-controller";
import { DocumentKind } from "@helper/abstraction/documents";
import { Observable } from "rxjs";

export class Einvoicepmt extends DocumentController<IEinvoicepmt> {
	public get apiUrl(): string { return `${this.config.api.einvoicepmt}`; }

	public draft = {
		get$: <T extends DocumentKind>(draftId: number): Observable<T> => {
			const url = `${this.apiUrl}/draft/${draftId}`;
			return this.http.get<T>(url, { withCredentials: true });
		},
	};

	public blrapn = {
		create2650ByEinvoicepmt: {
			post$: (documentId: number): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.apiUrl}/draft/blrapn/create2650ByEinvoicepmt`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, documentId, { withCredentials: true });
			}
		},
		saveSigned2650ByEinvoicepmt: {
			post$: (blrapnDraftId: number, signedXml: string): Observable<any> => {
				const url = `${this.apiUrl}/draft/blrapn/saveSigned2650ByEinvoicepmt`;
				return this.http.post<any>(url, { blrapnDraftId, xml: signedXml }, { withCredentials: true });
			}
		},
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
}
