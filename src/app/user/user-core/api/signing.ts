import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { Observable } from "rxjs";
import { SignedDraftDto } from "@helper/abstraction/draft";

export class Signing {
	constructor(private config: ConfigurationService, private http: HttpClient) { }

	public post$(xml: string, time?: Date): Observable<SignedDraftDto> {
		const timestamp = time && Number.isFinite(+time) ? +time : +(new Date());
		const url = `${this.config.signingService}/signXml`;
		const body = new URLSearchParams();
		body.set("timestamp", timestamp.toString());
		body.set("xml", xml);

		const options = {
			headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
		};

		return this.http.post<SignedDraftDto>(url, body.toString(), options);
	}
}
