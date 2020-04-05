import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { StatisticEwaybillFormValue } from "@helper/abstraction/statistic";

@Injectable()
export class StatisticCookieService {
	constructor(
		private readonly cookieService: CookieService
	) { }

	public setEwaybillFilterValue(filterValue: StatisticEwaybillFormValue): void {
		this.cookieService.set("ewaybillFilter", JSON.stringify(filterValue));
	}

	public getEwaybillFilterValue(): StatisticEwaybillFormValue {
		return JSON.parse(this.cookieService.get("ewaybillFilter"));
	}

	public clearEwaybillFilterValue(): void {
		this.cookieService.delete("ewaybillFilter");
	}

	public isEwaybillFilterValueExist(): boolean {
		return this.cookieService.check("ewaybillFilter");
	}
}
