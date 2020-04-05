import { first } from "rxjs/operators";

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UserAuthService } from "./user-auth.service";

@Injectable()
export class UserAuthGuard implements CanActivate {

	constructor(
		private readonly router: Router,
		private readonly authService: UserAuthService,
	) { }

	public async canActivate(): Promise<boolean> {
		const token = await this.authService.token$.pipe(first()).toPromise();

		if (!token) {
			this.router.navigate(["user/login"]);
			return false;
		} else
			return true;
	}
}
