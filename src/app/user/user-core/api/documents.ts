import { Observable } from "rxjs";

import { HttpClient, HttpResponse } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { DocumentKind, DocumentsDto, DocumentsParams, DocumentType } from "@helper/abstraction/documents";
import { DraftDto, DraftType } from "@helper/abstraction/draft";
import { UserBackendService } from "../user-backend.service";
import { UserPermissionService } from "../user-permission.service";

export class Documents {
	public list = {
		get$: (dp: DocumentsParams): Observable<DocumentsDto> => {
			return this.userBackendService.getController(dp.documentTypeId).list.get$(dp);
		}
	};

	public processingStatuses = {
		list: {
			get$: (documentTypeId: DocumentType): Observable<any> => {
				const url = `${this.config.api.root}/documents/${documentTypeId}/processing-statuses/list`;
				return this.http.get<any[]>(url, { withCredentials: true });
			}
		}
	};

	public createWithValidation = {
		post$: (draftType: DraftType, msgEwaybillDraftDto: DocumentKind): Observable<DraftDto> => {
			const type = this.userPermissionService.getDocumentType(draftType);
			if (!type)
				throw Error("Can't define type by pass draftType");
			return this.userBackendService.getController(type).createWithValidation.post$(draftType, msgEwaybillDraftDto);
		}
	};

	public saveSigned = {
		post$: (draftType: DraftType, documentDto: { id: string; xmlBody: string }): Observable<any> => {
			const type = this.userPermissionService.getDocumentType(draftType);
			if (!type)
				throw Error("Can't define type by pass draftType");
			return this.userBackendService.getController(type).saveSigned.post$(draftType, documentDto);
		}
	};

	public downloadArchive = {
		post$: (documentIds: number[], documentType: DraftType, reportFormatType: string): Observable<HttpResponse<Blob>> => {
			const type = this.userPermissionService.getDocumentType(documentType);
			if (!type)
				throw Error("Can't define type by pass draftType");
			return this.userBackendService.getController(type).downloadArchive.post$(documentIds, reportFormatType);
		}
	};

	constructor(
		private config: ConfigurationService,
		private http: HttpClient,
		private userBackendService: UserBackendService,
		private userPermissionService: UserPermissionService
	) { }
}
