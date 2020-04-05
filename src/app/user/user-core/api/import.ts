import { DocumentType } from "@helper/abstraction/documents";
import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class Import {

	constructor(private config: ConfigurationService, private http: HttpClient) { }

	public post$(draftType: DocumentType, file: File): Observable<any> {
		const url = `${this.config.api.root}/import/${draftType}/zipWithXml`;
		const formData: FormData = new FormData();
		formData.append("zipArchive", file, file.name);
		return this.http.post(url, formData, { withCredentials: true });
	}
}
