import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { MonthPickerComponent } from "../month-picker/month-picker.component";

@Component({
	selector: "app-month-range-picker",
	templateUrl: "./month-range-picker.component.html",
	styleUrls: ["../date-picker/date-picker.component.scss", "./month-range-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthRangePicker extends MonthPickerComponent {
	@Input() public doubleValue?: [Date, Date];
	@Output() public doubleValueChange = new EventEmitter<[Date, Date]>();
	private iterator?: IterableIterator<number>;

	public setRangeByOrder(date: Date): void {
		let iteration = this.iterator && this.iterator.next();

		if (!iteration || iteration.done) {
			this.iterator = this.getIterator(); // new
			iteration = this.iterator.next();
		}

		let newValue: [Date, Date];

		if (iteration.value === 1 && Array.isArray(this.doubleValue))
			newValue = [this.doubleValue[0], new Date(+date)];
		else
			newValue = [new Date(+date), new Date(+date)];

		if (newValue[0] > newValue[1])
			newValue = newValue.reverse() as [Date, Date];

		this.doubleValue = newValue;
		this.doubleValueChange.emit(this.doubleValue);
	}

	public isRangeContain(date: Date): boolean {
		if (!this.doubleValue)
			return false;
		return date > this.doubleValue[0] && date < this.doubleValue[1];
	}

	public isStart(date: Date): boolean {
		if (!Array.isArray(this.doubleValue))
			return false;
		else
			return this.isToday.call({ now: this.doubleValue[0] }, date);
	}

	public isEnd(date: Date): boolean {
		if (!Array.isArray(this.doubleValue))
			return false;
		else
			return this.isToday.call({ now: this.doubleValue[1] }, date);
	}

	public *getIterator(): IterableIterator<number> {
		yield 0;
		yield 1;
	}
}
