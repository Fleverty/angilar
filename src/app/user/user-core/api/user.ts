import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigurationService } from "@core/configuration.service";
import { ChangeUserPassword } from "@helper/abstraction/sections";
import { Observable } from "rxjs";
import { UserProfileDto, UserProfile, UserActivateParams } from "@helper/abstraction/user";
import { map } from "rxjs/operators";
import { StoragesParams, StoragesDto } from "@helper/abstraction/storages";
import { Controller } from "./controller";

export class User extends Controller {
	public get apiUrl(): string { return `${this.config.api.user}`; }

	public changePassword = {
		put$: (data: ChangeUserPassword): Observable<void> => {
			const url = `${this.apiUrl}/changePassword`;
			return this.http.put<void>(url, data, { withCredentials: true });
		}
	};

	public restorePassword = {
		put$: (email: string): Observable<void> => {
			const url = `${this.apiUrl}/recoverPassword`;
			return this.http.put<void>(url, { userEmail: email }, { withCredentials: true });
		}
	};

	public profile = {
		get$: (): Observable<UserProfile> => {
			const url = `${this.apiUrl}/profile`;
			return this.http.get<UserProfileDto>(url, { withCredentials: true }).pipe(
				map(userProfile => {
					return {
						login: userProfile.login,
						lastName: userProfile.lastName,
						firstName: userProfile.firstName,
						middleName: userProfile.middleName,
						jobPost: userProfile.jobPost,
						email: userProfile.email,
						phoneNumber: userProfile.phoneNumber,
						updateProfile: new Date(userProfile.updateProfile),
						lastAuthorization: new Date(userProfile.lastAuthorization),
						storage: userProfile.storage,
						rememberLogin: userProfile.rememberLogin
					};
				})
			);
		},

		save: {
			post$: (data: UserProfile): Observable<void> => {
				const url = `${this.config.api.root}/user/profile/save`;
				return this.http.post<void>(url, data, { withCredentials: true });
			}
		}
	};

	public storages = {
		list: {
			get$: (sp: StoragesParams): Observable<StoragesDto> => {
				const url = `${this.config.api.root}/user/storages/list`;
				let params = new HttpParams();
				params = params.set("page", sp.page.toString());
				params = params.set("size", sp.size.toString());
				if (sp.searchText)
					params = params.set("storageName", sp.searchText);
				return this.http.get<StoragesDto>(url, { params, withCredentials: true });
			}
		}
	};

	public activate = {
		post$: (body: UserActivateParams): Observable<any> => {
			const url = `${this.apiUrl}/activate`;
			return this.http.post<any>(url, body);
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) {
		super();
	}
}
