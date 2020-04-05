import { Injectable, Inject } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable()
export class UserRoutingService {
	private history: string[] = [];
	private isServiceWorking = false;

	constructor(
		private router: Router,
		private readonly activatedRoute: ActivatedRoute,
		@Inject("itemsToStore") public itemsToStore: number,
	) {
		if (!itemsToStore)
			throw new Error("Please provide \"itemsToStore\" to UserRoutingService");
	}

	public loadRouting(): void {
		if (this.isServiceWorking)
			throw new Error("Routing service already working");
		this.isServiceWorking = true;
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				if (this.history[this.history.length - 1] === event.urlAfterRedirects.split("?")[0]) {
					this.history[this.history.length - 1] =  event.urlAfterRedirects;
					return;
				}
				this.history = [...this.history.splice((this.itemsToStore * -1) + 1), event.urlAfterRedirects];
			});
	}

	public navigateBack(opts?: { force?: boolean; redirectTo?: string }): void {
		if (opts && opts.redirectTo) {
			this.router.navigateByUrl(opts.redirectTo);
			return;
		}
		if (this.history.length <= 2 || (opts && opts.force)) {
			if (window)
				window.history.go(-1);
			return;
		}
		const queryParams: { [property: string]: string } = {};
		const [link, rawQueryParams] = this.history[this.history.length - 2].split("?");
		if (rawQueryParams && rawQueryParams.length)
			rawQueryParams.split("&").forEach((params: string) => {
				const [property, key] = params.split("=");
				queryParams[property] = key;
			});
		this.router.navigateByUrl(link, { queryParams });
	}
}
