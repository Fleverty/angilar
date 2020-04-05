import { AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, Input, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output, OnInit, HostListener } from "@angular/core";
import { Time } from "@angular/common";
import { TextUtil } from "@helper/text-util";

@Component({
	selector: "app-select-date",
	templateUrl: "./select-date.component.html",
	styleUrls: ["./select-date.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDateComponent implements OnInit, AfterViewInit, OnChanges {
	public textUtil = TextUtil;
	@Input() public value?: Date;
	@Input() public withTime = false;
	@Output() public appEnter = new EventEmitter<Date | void>();
	@Output() public appSetNewDate = new EventEmitter<Date | void>();
	@Output() public appSetTime = new EventEmitter<Time | void>();
	@Output() public appClear = new EventEmitter<void>();
	@ViewChild("date", { static: true }) public date?: ElementRef<HTMLInputElement>;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef
	) { }

	public ngOnInit(): void {
		this.appSetNewDate.emit(this.value);
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.value && simpleChanges.value.currentValue) {
			this.sync();
		}
	}

	@HostListener("document:keyup", ["$event"])
	public onEnter(event: any): void {
		event.preventDefault();
		event.stopPropagation();
		if (event.target && event.keyCode === 13) {
			this.tryClose();

		}
	}

	public onValueChange(value: Date): void {
		this.value = value;
		this.changeDetectorRef.detectChanges();
		this.sync();
		this.setDate(this.value);
	}

	public emitTime(time: Time): void {
		this.appSetTime.emit(time);
	}

	public ngAfterViewInit(): void {
		this.date && this.date.nativeElement.focus();
	}

	public onInputDate(stringDate: string): void {
		if (stringDate) {
			const date = new Date(stringDate);
			this.value = date;
			this.sync();
			if (+stringDate.split("-")[0] < 999)
				return;
			this.setDate(this.value);
		}
	}

	public tryClose(): void {
		// this.appSetNewDate.emit(this.value);
		this.appEnter.emit(this.value);
	}

	public setDate(date: Date): void {
		this.value = date;
		this.changeDetectorRef.detectChanges();
		this.appSetNewDate.emit(this.value);
	}

	public sync(): void {
		if (this.date && this.value && this.value.toString() !== "Invalid Date")
			this.date.nativeElement.value = this.getDateString(this.value);
	}

	public clear(): void {
		this.appClear.emit();
	}

	private getDateString(date: Date): string {
		return this.textUtil.toFourSymbol(date.getFullYear()) + "-" + this.textUtil.toTwoSymbol(date.getMonth() + 1) + "-" + this.textUtil.toTwoSymbol(date.getDate());
	}
}
