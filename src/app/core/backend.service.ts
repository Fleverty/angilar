import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class BackendService {
	public readonly version = {
		get$: (): Observable<string> => {
			const url = "VERSION.txt";
			return this.httpClient.get(url, {
				headers: {
					"cache-control": ["no-cache", "no-store", "must-revalidate"]
				},
				responseType: "text"
			}) as Observable<string>;
		}
	};

	constructor(private httpClient: HttpClient) { }
}
