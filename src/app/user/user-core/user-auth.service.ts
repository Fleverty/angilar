import { Observable, throwError, Subscription } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { Injectable, OnDestroy } from "@angular/core";
import { AuthenticateResponce } from "@helper/abstraction/authenticate";
import { createSelector, select, Store } from "@ngrx/store";

import * as UserActions from "../user.actions";
import { UserState } from "../user.reducer";
import { UserBackendService } from "./user-backend.service";

const TOKEN_KEY = "token.user.v1";

@Injectable()
export class UserAuthService implements OnDestroy {
	public isForgetMe = true;
	public token$: Observable<string | undefined>;

	private subscribtion?: Subscription;

	constructor(
		private readonly backendService: UserBackendService,
		private readonly store: Store<UserState>
	) {
		const selectUser = (appState: any): UserState => appState.user;
		const selectToken = createSelector(selectUser, (state: UserState): string | undefined => state.token);
		this.token$ = this.store.pipe(select(selectToken));
		const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || undefined;
		this.store.dispatch(UserActions.setToken(token));
	}

	public login$(user: string, password: string): Observable<AuthenticateResponce> {
		return this.backendService.authenticate.authenticate.post$(user, password).pipe(
			tap(res => this.saveTokenToSession(res.uuid)),
			tap(res => this.store.dispatch(UserActions.setToken(res.uuid))),
			tap(res => this.store.dispatch(UserActions.setRoles(res.userRoles))),
			catchError(err => {
				this.store.dispatch(UserActions.setToken(undefined));
				return throwError(err);
			})
		);
	}

	public loginAndRemember$(user: string, password: string): Observable<AuthenticateResponce> {
		this.isForgetMe = false;
		return this.login$(user, password).pipe(
			tap(res => this.pushToken(res.uuid))
		);
	}

	public isShowRememberLoginButton(): Observable<boolean> {
		return this.backendService.config.rememberLogin.get$();
	}

	public logout(): void {
		this.pushToken(undefined);
		this.saveTokenToSession(undefined);
	}

	public ngOnDestroy(): void {
		if (this.isForgetMe)
			this.logout();
		if (this.subscribtion)
			this.subscribtion.unsubscribe();
	}

	private pushToken(token?: string): void {
		if (token)
			localStorage.setItem(TOKEN_KEY, token);
		else
			localStorage.removeItem(TOKEN_KEY);
	}

	private saveTokenToSession(token?: string): void {
		if (token)
			sessionStorage.setItem(TOKEN_KEY, token);
		else
			sessionStorage.removeItem(TOKEN_KEY);
	}
}
