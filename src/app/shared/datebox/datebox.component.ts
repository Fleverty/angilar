import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	Input,
	Type,
	ChangeDetectorRef,
	HostBinding,
	OnInit, OnDestroy
} from "@angular/core";
import { AbstractControl, ControlContainer, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";
import { Time } from "@angular/common";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
	selector: "app-datebox",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<DateboxComponent> => DateboxComponent)
	}],
	templateUrl: "./datebox.component.html",
	styleUrls: ["./datebox.component.scss", "../rangebox/rangebox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateboxComponent extends BoxValueAccessor implements OnInit, OnDestroy {
	@Input() public placeholder?: string;
	@Input() public withTime = false;
	@Input() public isDisabled?: boolean;
	@Input() public disableAutoCheck = false;
	@Input() public formControlName?: string;
	@Input() public displayValidation = true;
	@Input() public error = false;
	@Input() public formControl?: AbstractControl;
	@HostBinding("attr.disabled")
	public get disabled(): "" | null { return this.isDisabled ? "" : null; }
	public expand = false;
	public value?: Date;
	public date?: Date;
	public time?: Time;

	public showError = false;
	public control?: AbstractControl | null;

	public unsubscribe$$ = new Subject<void>();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		public readonly controlContainer: ControlContainer
	) {
		super();
	}
	// @HostListener("window:keyup", ["$event"])
	// public onEnter(event: any): void {
	// 	if (event.target && event.keyCode === 13)
	// 		this.tryClose();
	// }

	public ngOnInit(): void {
		if (!this.displayValidation)
			return;

		if (this.formControl)
			this.control = this.formControl;

		if (this.controlContainer && this.formControlName && this.controlContainer.control)
			this.control = this.controlContainer.control.get(this.formControlName);

		// Subscribe need to change control touched state
		this.control && this.control.statusChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (!this.error)
				this.showError = this.control && this.control.touched && this.control.invalid || false;
			else
				this.showError = this.error;
			this.changeDetectorRef.detectChanges();
		});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	// rewrite
	public writeValue(value: Date): void {
		this.value = value;
		const newDate = new Date(value);
		if (this.time) {
			newDate.setHours(this.time.hours);
			newDate.setMinutes(this.time.minutes);
			this.value = newDate;
		}
		this.changeDetectorRef.markForCheck();
	}

	// rewrite
	public selectDate(date?: Date): void {
		if (date) {
			if (this.withTime) {
				if (!this.time)
					this.time = {
						hours: 0,
						minutes: 0,
					};
				date.setHours(this.time.hours);
				date.setMinutes(this.time.minutes);
			}
			if (this.onChange)
				this.onChange(date);
			this.writeValue(date);
			this.expand = false;
		} else
			this.expand = false;
	}

	public tryClose(): void {
		this.selectDate(this.date);
	}


	// rewrite it
	public setTime(time: Time): void {
		this.time = time;
	}

	public setNewDate(date: Date): void {
		this.date = date;

		if (this.withTime)
			return;

		const isDateEqualValue = !!(this.value && this.date && this.value.getTime() !== this.date.getTime());
		const isExistOnlyThisDate = !this.value && this.date;

		if (isDateEqualValue || isExistOnlyThisDate)
			this.selectDate(this.date);
	}

	public onClickOutside(): void {
		if (this.expand) {
			this.selectDate(this.date);
		}
	}

	public toExpand(): void {
		if (typeof this.value === "string")
			throw Error("Does not match date type!");

		if (!this.expand)
			this.expand = !this.expand;
		else
			this.selectDate(this.date);
	}

	public setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	public clear(): void {
		this.value = undefined;
		this.time = undefined;
		this.date = undefined;
		if (this.onChange)
			this.onChange(this.value);
		this.changeDetectorRef.markForCheck();
		this.expand = false;
	}
}
