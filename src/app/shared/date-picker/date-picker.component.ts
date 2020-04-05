import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "app-date-picker",
	templateUrl: "./date-picker.component.html",
	styleUrls: ["./date-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent {
	@Input() public value?: Date;
	@Input() public date = new Date();
	@Output() public valueChange = new EventEmitter<Date>();
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

	public setValue(value: Date): void {
		this.value = value;
		this.valueChange.emit(value);
	}
}
