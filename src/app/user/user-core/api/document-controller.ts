import { DocumentsParams, DocumentsDto, DocumentKind, DocumentBody } from "@helper/abstraction/documents";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { Controller } from "./controller";
import { map } from "rxjs/operators";
import { DraftDto, DraftType } from "@helper/abstraction/draft";

// unit different document type 
export abstract class DocumentController<T extends DocumentKind> extends Controller {
	public cancel = {
		get$: (documentId: string): Observable<string> => {
			const url = `${this.apiUrl}/${documentId}/cancel`;
			return this.http.get<{ xmlBody: string }>(url, { withCredentials: true }).pipe(map(xml => xml.xmlBody));
		}
	};

	public list = {
		get$: (dp: DocumentsParams): Observable<DocumentsDto> => {
			const url = `${this.apiUrl}/${dp.documentState.toUpperCase()}/list`;

			const db: DocumentBody = {
				documentNumber: dp.documentNumber,
				documentDateStart: dp.documentDateStart,
				documentDateEnd: dp.documentDateEnd,
				partnerId: dp.partnerId,
				storageId: dp.storageId,
				documentStage: dp.documentStage,
				processingStatusId: dp.processingStatusId,
			};
			for (const key in db) {
				if (db[key as keyof DocumentBody] === null) {
					delete db[key as keyof DocumentBody];
				}
			}

			let params = new HttpParams();
			params = params.set("page", dp.page.toString());
			params = params.set("size", dp.size.toString());

			return this.http.post<DocumentsDto>(url, db, { withCredentials: true, params });
		}
	};

	public createWithValidation = {
		post$: (draftType: DraftType, msgEwaybillDraftDto: DocumentKind): Observable<DraftDto> => {
			const url = `${this.apiUrl}/draft/createWithValidation`;
			return this.http.post<DraftDto>(url, msgEwaybillDraftDto, { withCredentials: true });
		}
	};

	public saveSigned = {
		post$: (draftType: DraftType, documentDto: { id: string; xmlBody: string }): Observable<any> => {
			const url = `${this.apiUrl}/draft/saveSigned`;
			return this.http.post(url, documentDto, { withCredentials: true });
		}
	};

	public downloadArchive = {
		post$: (documentIds: number[], reportFormatType: string): Observable<HttpResponse<Blob>> => {
			const url = `${this.apiUrl}/downloadArchive/${reportFormatType}`;
			return this.http.post<Blob>(url, documentIds, {
				withCredentials: true,
				responseType: "blob" as "json",
				observe: "response"
			});
		}
	};

	constructor(protected http: HttpClient) { super(); }

	public get$(documentId: number): Observable<T> {
		const url = `${this.apiUrl}/${documentId}`;
		return this.http.get<T>(url, { withCredentials: true });
	}

	public getDraft$(documentId: number): Observable<T> {
		const url = `${this.apiUrl}/draft/${documentId}`;
		return this.http.get<T>(url, { withCredentials: true });
	}
}
