import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output,
	SimpleChanges
} from "@angular/core";

interface Year {
	date: Date;
	disabled: boolean;
	isOutside: boolean;
}

@Component({
	selector: "app-year-picker",
	templateUrl: "./year-picker.component.html",
	styleUrls: ["./../date-picker/date-picker.component.scss", "./year-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearPickerComponent {
	@Input() public now: Date = new Date();
	@Input() public value?: Date;
	@Output() public changePicker = new EventEmitter<Date>();
	@Output() public valueChange = new EventEmitter<Date>();
	public date: Date = new Date();
	public years: Year[] = [];

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.value && this.value) {
			this.setView(this.value);
		} else {
			this.date = this.now || new Date();
			this.setView(this.date);
		}

		if (simpleChanges.now && !this.now)
			this.now = new Date();
	}

	public switchYear(date: Date, isForward: boolean): void {
		date = new Date(date.valueOf());
		date.setDate(1);
		date.setFullYear(date.getFullYear() + (isForward ? 1 : -1));
		this.date = date;
		this.setView(date);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(date: Date): boolean {
		if (!this.value)
			return false;
		return date.getFullYear() === this.value.getFullYear()
			&& date.getMonth() === this.value.getMonth();
	}

	public setYear(date: Date): void {
		this.value = new Date(date.valueOf());
		this.date = this.value;
		this.valueChange.emit(date);
	}

	public isToday(date: Date): boolean {
		return date.getFullYear() === this.now.getFullYear()
			&& date.getMonth() === this.now.getMonth();
	}

	public setView(date: Date): void {
		let year = new Date(date.getFullYear(), 0, 1);
		const years: Year[] = [];
		do {
			years.push({
				date: year,
				disabled: false,
				isOutside: year.getFullYear() !== date.getFullYear(),
			});
			year = new Date(year.valueOf());
			year.setMonth(year.getMonth() + 1);
		} while (years.length < 12);

		this.years = years;
		this.date = date;
		this.changeDetectorRef.detectChanges();
	}
}

