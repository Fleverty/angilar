import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class TodayService {
	private now = new Date();

	public get todayRange(): [Date, Date] {
		return [new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()), new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 23, 59, 59, 59)];
	}
}
