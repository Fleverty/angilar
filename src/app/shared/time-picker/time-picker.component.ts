import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from "@angular/core";
import { Time } from "@angular/common";
import { TextUtil } from "@helper/text-util";

@Component({
	selector: "app-time-picker",
	templateUrl: "./time-picker.component.html",
	styleUrls: ["./time-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnInit {
	@Input() public value?: Date;
	@Output() public appEmitTime = new EventEmitter<Time | void>();
	@ViewChild("time", { static: true }) public time?: ElementRef<HTMLInputElement>;
	@ViewChild("ulList", { static: true }) public ulList?: ElementRef<HTMLUListElement>;
	public textUtil = TextUtil;
	public timeList: Time[] = [];
	public selectedTime?: Time | null;
	public nowTime?: Time;

	constructor() {
		this.timeList = this.getTimeList();
		this.nowTime = this.getTime(new Date());
	}

	public ngOnInit(): void {
		if (this.value) {
			this.selectedTime = this.getTime(this.value);
			this.synchronise(this.value);
			this.appEmitTime.emit({ hours: this.value.getHours(), minutes: this.value.getMinutes() });
		}
	}

	public ngAfterViewInit(): void {
		if (this.selectedTime) {
			const ts = this.toTimeString(this.selectedTime);
			const selectedTimeIdex = this.timeList.findIndex(time => this.toTimeString(time) === ts);

			if (selectedTimeIdex !== -1)
				this.scrollTo(this.startToCenter(selectedTimeIdex));
		}
	}

	public scrollTo(index: number): void {
		if (!this.ulList || !this.ulList.nativeElement || !this.ulList.nativeElement.parentElement)
			throw Error("No list");

		if (!this.timeList.length)
			return;
		const oneHeight = this.ulList.nativeElement.clientHeight / this.timeList.length;

		this.ulList.nativeElement.parentElement.scrollTo(0, index * oneHeight);
	}

	public startToCenter(index: number): number {
		const viewCount = 10;
		const offset = Math.floor((viewCount - 1) / 2);
		return index > offset ? index - offset : 0;
	}

	public synchronise(date: Date): void {
		if (this.time)
			this.time.nativeElement.value = `${this.textUtil.toTwoSymbol(date.getHours())}:${this.textUtil.toTwoSymbol(date.getMinutes())}`;
	}

	public getTimeList(): Time[] {
		const hours = Array.from({ length: 24 }, (v, i) => i);
		return hours.reduce((timeList, hours) => {
			for (let minutes = 0; minutes < 60; minutes += 30)
				timeList.push({ hours, minutes });
			return timeList;
		}, [] as Time[]);
	}

	public onInputTime(time: string): void {
		if (!time)
			return;

		if (!this.value)
			throw new Error("No value!");

		const newTime = time.split(":");
		const newDate = new Date(this.value);
		newDate.setHours(+newTime[0]);
		newDate.setMinutes(+newTime[1]);
		this.synchronise(newDate);
		this.selectedTime = this.getTime(newDate);
		this.appEmitTime.emit({ hours: +newTime[0], minutes: +newTime[1] });
	}

	public setTime(time?: Time | null): void {
		const newDate = this.value ? new Date(this.value) : new Date();
		this.selectedTime = time;
		if (time) {
			newDate.setHours(time.hours);
			newDate.setMinutes(time.minutes);
			this.synchronise(newDate);
			this.appEmitTime.emit(time);
		}
	}

	public toTimeString(time?: Time | null): string {
		if (!time)
			return "";
		return `${this.textUtil.toTwoSymbol(time.hours)}:${this.textUtil.toTwoSymbol(time.minutes)}`;
	}

	private getTime(date: Date): Time {
		if (date.getMinutes() > 30 && date.getHours() < 23) {
			return { hours: date.getHours() + 1, minutes: 0 };
		} else if (date.getMinutes() === 0)
			return { hours: date.getHours(), minutes: 0 };
		else if (date.getHours() === 23 && date.getMinutes() > 30)
			return { hours: 0, minutes: 0 };
		else
			return { hours: date.getHours(), minutes: 30 };
	}
}


