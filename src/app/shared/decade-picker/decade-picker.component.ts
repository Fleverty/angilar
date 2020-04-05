import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges
} from "@angular/core";

interface Decade {
	date: Date;
	disabled: boolean;
	isOutside: boolean;
}
@Component({
	selector: "app-decade-picker",
	templateUrl: "./decade-picker.component.html",
	styleUrls: ["./../date-picker/date-picker.component.scss", "./decade-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecadePickerComponent {
	@Input() public now?: Date;
	@Input() public value?: Date;
	@Output() public valueChange = new EventEmitter<Date>();
	@Output() public changePicker = new EventEmitter<Date>();
	public date: Date;
	public decades: Decade[] = [];

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		this.date = this.now || new Date();
	}

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

	public switchDecade(date: Date, isForward: boolean): void {
		date = new Date(date.valueOf());
		date.setDate(1);
		date.setFullYear(date.getFullYear() + (isForward ? 10 : -10));
		this.date = date;
		this.setView(this.date);
		this.changeDetectorRef.detectChanges();
	}

	public isToday(date?: Date): boolean {
		return !!this.now && !!date && date.getFullYear() === this.now.getFullYear();
	}

	public isSelected(date?: Date): boolean {
		if (!this.value || !date)
			return false;
		return date.getFullYear() === this.value.getFullYear();
	}


	public setDecade(date?: Date): void {
		if (date) {
			this.value = new Date(date.valueOf());
			this.date = this.value;
			this.valueChange.emit(date);
		}
	}

	public setView(date?: Date): void {
		if (date) {
			let year = new Date(date.getFullYear() - 5, 0, 1);
			const years: Decade[] = [];
			do {
				years.push({
					date: year,
					disabled: false,
					isOutside: year.getFullYear() !== date.getFullYear(),
				});
				year = new Date(year.valueOf());
				year.setFullYear(year.getFullYear() + 1);
			} while (years.length < 12);
			this.decades = years;
			this.date = date;
			this.changeDetectorRef.detectChanges();
		}
	}
}
