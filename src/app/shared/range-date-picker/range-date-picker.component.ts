import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-range-date-picker",
	templateUrl: "./range-date-picker.component.html",
	styleUrls: ["./range-date-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeDatePickerComponent {
	@Input() public value?: [Date, Date];
	@Input() public date = new Date();
	@Output() public valueChange = new EventEmitter<[Date, Date]>();
	public now = new Date();
	public mode: "month" | "year" | "decade" = "month";

	public askYearView(date: Date): void {
		this.mode = "year";
		this.date = date;
	}

	public askMonthView(date: Date): void {
		this.mode = "month";
		this.date = date;
	}

	public askDecadeView(date: Date): void {
		this.mode = "decade";
		this.date = date;
	}

	public setValue(value: [Date, Date]): void {
		this.value = value;
		this.valueChange.emit(value);
	}
}
