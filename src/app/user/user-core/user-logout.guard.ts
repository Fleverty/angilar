import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UserAuthService } from "./user-auth.service";
import { OverlayService } from "@core/overlay.service";
import { Title } from "@angular/platform-browser";
import { Store } from "@ngrx/store";
import { UserState } from "../user.reducer";
import { resetStore } from "@app/app.reducer";

@Injectable()
export class UserLogoutGuard implements CanActivate {
	constructor(
		private readonly title: Title,
		private readonly router: Router,
		private readonly authService: UserAuthService,
		private readonly overlayService: OverlayService,
		private store: Store<UserState>
	) { }

	public canActivate(): boolean {
		this.overlayService.clear();
		this.store.dispatch(resetStore());
		this.authService.logout();
		this.store.dispatch(resetStore());
		this.title.setTitle("Система \"Электронный бланк\"");
		this.router.navigate(["/user/login"]);
		return false;
	}
}
