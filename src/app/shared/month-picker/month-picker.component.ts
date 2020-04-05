import {
	FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleWeekEndRange, TranslationWidth
} from "@angular/common";
import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, LOCALE_ID,
	OnChanges, Output, SimpleChanges
} from "@angular/core";

interface Day {
	date: Date;
	disabled: boolean;
	isOutside: boolean;
}

@Component({
	selector: "app-month-picker",
	templateUrl: "./month-picker.component.html",
	styleUrls: ["./../date-picker/date-picker.component.scss", "./month-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthPickerComponent implements OnChanges {
	@Input() public now = new Date();
	@Input() public value?: Date;
	@Input() public date: Date = new Date(); // It'll set now, if date not preset 
	@Output() public valueChange = new EventEmitter<Date>();
	@Output() public changePicker = new EventEmitter<Date>();

	public daysOfWeek?: string[];
	public days: Day[] = [];
	public rowRemoved?: boolean;

	constructor(
		@Inject(LOCALE_ID) private readonly localeId: string,
		private readonly changeDetectorRef: ChangeDetectorRef
	) { }

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.value && this.value) {
			this.setView(this.value);
		} else if (!this.date) {
			this.date = this.now || new Date();
			this.setView(this.date);
		}

		if (simpleChanges.now && !this.now)
			this.now = new Date();

		if (simpleChanges.date && this.date)
			this.setView(this.date);
	}

	public switchMonth(date: Date, isForward: boolean): void {
		this.date = new Date(date.valueOf());
		this.date.setDate(1);
		this.date.setMonth(date.getMonth() + (isForward ? 1 : -1));
		this.setView(this.date);
		this.changeDetectorRef.detectChanges();
	}

	public setDay(date: Date): void {
		this.value = new Date(date.valueOf());
		this.date = this.value;
		this.valueChange.emit(date);
	}

	public isToday(date: Date): boolean {
		return date.getFullYear() === this.now.getFullYear()
			&& date.getMonth() === this.now.getMonth()
			&& date.getDate() === this.now.getDate();
	}

	public isWeekendConsiderRole(i: number): boolean {
		const firstDayOfWeek = getLocaleFirstDayOfWeek(this.localeId);
		const w = getLocaleWeekEndRange(this.localeId).map((weekDayIndex: number): number => {
			const temp = weekDayIndex - firstDayOfWeek;
			return temp >= 0 ? temp : 7 + temp;
		});

		if (w[0] === i || w[1] === i)
			return true;
		else
			return false;
	}

	public isWeekend(i: number): boolean {
		const w = getLocaleWeekEndRange(this.localeId);
		if (w[0] === i || w[1] === i)
			return true;
		else
			return false;
	}

	public isSelected(date: Date): boolean {
		if (!this.value)
			return false;
		return date.getFullYear() === this.value.getFullYear()
			&& date.getMonth() === this.value.getMonth()
			&& date.getDate() === this.value.getDate();
	}

	public capitalize(str?: string | null): string {
		return str ? (str.charAt(0).toUpperCase() + str.slice(1, str.length)) : "";
	}

	private setView(date: Date): void {
		const days: Day[] = [];
		let day = new Date(date.getFullYear(), date.getMonth(), 1);

		// locate first day of the week
		const firstDayOfWeek = getLocaleFirstDayOfWeek(this.localeId);
		const daysOfWeek = getLocaleDayNames(this.localeId, FormStyle.Standalone, TranslationWidth.Short).map((e): string => this.capitalize(e)); // we need a copy of array because we will modify it
		for (let i = 0; i < firstDayOfWeek; i++)
			daysOfWeek.push(daysOfWeek.shift() || "");
		do {
			day.setDate(day.getDate() - 1);
		} while (day.getDay() !== firstDayOfWeek);

		do {
			days.push({
				date: day,
				disabled: false,
				isOutside: day.getMonth() !== date.getMonth(),
			});
			day = new Date(day.valueOf());
			day.setDate(day.getDate() + 1);
		} while (days.length < 42);

		this.daysOfWeek = daysOfWeek;
		this.days = days;
		this.rowRemoved = false;
		this.changeDetectorRef.detectChanges();
	}
}
