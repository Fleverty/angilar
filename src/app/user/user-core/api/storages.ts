import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { StorageCreateDto } from "@helper/abstraction/storages";

export class Storages {
	public list = {
		put$: (storage: StorageCreateDto): Observable<StorageCreateDto> => {
			const url = `${this.config.api.root}/storage`;
			return this.http.put<StorageCreateDto>(url, storage, { withCredentials: true });
		},

		delete$: (storageIds: number[]): Observable<string[]> => {
			const url = `${this.config.api.root}/storage`;
			const options = {
				headers: new HttpHeaders({
					"Content-Type": "application/json",
				}),
				body: storageIds,
				withCredentials: true
			};
			return this.http.delete<string[]>(url, options);
		},

		confirmDeleting$: (storageIds: number[]): Observable<void> => {
			const url = `${this.config.api.root}/storage/deleteFinal`;
			const options = {
				headers: new HttpHeaders({
					"Content-Type": "application/json",
				}),
				body: storageIds,
				withCredentials: true
			};
			return this.http.delete<void>(url, options);
		},
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
