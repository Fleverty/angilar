import {
	AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
	HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild
} from "@angular/core";
import { TextUtil } from "@helper/text-util";

@Component({
	selector: "app-select-date-range",
	templateUrl: "./select-date-range.component.html",
	styleUrls: ["./select-date-range.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDateRangeComponent implements AfterViewInit, OnChanges {
	@Input() public value: [Date, Date] = [new Date(), new Date()];
	@Output() public appClose = new EventEmitter<[Date, Date] | void>();
	@ViewChild("start", { static: true }) public start?: ElementRef<HTMLInputElement>;
	@ViewChild("end", { static: true }) public end?: ElementRef<HTMLInputElement>;
	public nextMonth: Date;
	public textUtil = TextUtil;
	private today = new Date();
	private picker: 1 | 2 = 1;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		const d = new Date(this.today);
		d.setMonth(this.today.getMonth() + 1);
		this.nextMonth = d;
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.value) {
			this.synchronise();
		}
	}

	@HostListener("window:keyup", ["$event"])
	public onEnter(event: any): void {
		if (event.target && event.keyCode === 13)
			this.tryClose(this.getDateString(this.value[0]), this.getDateString(this.value[1]));
	}

	public onValueChange(value: [Date, Date], picker: 1 | 2): void {
		if (this.picker !== picker && +this.value[0] === +this.value[1] && +value[0] === +value[1]) {
			const pv = +this.value[0]; // предыдущее значение
			const cv = +value[0]; // текущее значение
			this.value = pv < cv ? [new Date(pv), new Date(cv)] : [new Date(cv), new Date(pv)];
		} else {
			this.value = value;
		}
		this.picker = picker;

		this.changeDetectorRef.detectChanges();
		this.synchronise();
	}

	public ngAfterViewInit(): void {
		if (this.start)
			this.start.nativeElement.focus();
	}

	public onInputStart(s: string): void {
		const date = new Date(s);
		if (Number.isFinite(+date)) {
			if (date <= this.value[1])
				this.value = [date, this.value[1]];
			else
				this.value = [date, date];
		}
		this.synchronise();
	}

	public tryClose(startValue: string, endValue: string): void {
		const start = new Date(startValue + " 00:00:00");
		if (!Number.isFinite(+start))
			return this.start && this.start.nativeElement.focus();
		const end = new Date(endValue + " 23:59:59");
		if (!Number.isFinite(+end))
			return this.end && this.end.nativeElement.focus();
		this.setRange(start, end);
	}

	public setRange(start: Date, end: Date): void {
		this.value = [start, end];
		this.changeDetectorRef.detectChanges();
		this.appClose.emit([start, end]);
	}

	public synchronise(): void {
		if (!Array.isArray(this.value))
			this.value = [new Date(+this.today), new Date(+this.today)];
		if (this.start && this.value[0])
			this.start.nativeElement.value = this.getDateString(this.value[0]);
		if (this.end && this.value[1])
			this.end.nativeElement.value = this.getDateString(this.value[1]);
	}

	public setToday(): void {
		const newDateStart = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0, 0, 0, 0);
		const newDateEnd = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 23, 59, 59, 59);
		this.setRange(newDateStart, newDateEnd);
	}

	public setYesterday(): void {
		const newDateStart = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1, 0, 0, 0, 0);
		const newDateEnd = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1, 23, 59, 59, 59);
		this.setRange(newDateStart, newDateEnd);
	}

	public setThisWeek(): void {
		const from = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1 - this.today.getDay(), 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7 - this.today.getDay(), 23, 59, 59, 59);
		this.setRange(from, to);
	}

	public setLastWeek(): void {
		const from = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 6 - this.today.getDay(), 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay(), 23, 59, 59, 59);
		this.setRange(from, to);
	}

	public setThisMonth(): void {
		const from = new Date(this.today.getFullYear(), this.today.getMonth(), 1, 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0, 23, 59, 59, 59);
		this.setRange(from, to);
	}

	public setThisYear(): void {
		const from = new Date(this.today.getFullYear(), 0, 1, 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear() + 1, 0, 0, 23, 59, 59, 59);
		this.setRange(from, to);
	}

	public setLastMonth(): void {
		const from = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1, 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear(), this.today.getMonth(), 0, 23, 59, 59, 59);
		this.setRange(from, to);
	}

	public setLastYear(): void {
		const from = new Date(this.today.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
		const to = new Date(this.today.getFullYear(), 0, 0, 23, 59, 59, 59);
		this.setRange(from, to);
	}

	private getDateString(date: Date): string {
		return this.textUtil.toFourSymbol(date.getFullYear()) + "-" + this.textUtil.toTwoSymbol(date.getMonth() + 1) + "-" + this.textUtil.toTwoSymbol(date.getDate());
	}
}
