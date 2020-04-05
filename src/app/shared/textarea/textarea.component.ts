import {
	ChangeDetectionStrategy, Component, forwardRef, Input, Type, ChangeDetectorRef, OnInit, OnDestroy
} from "@angular/core";
import { BoxValueAccessor } from "@shared/box-value-accessor/BoxValueAccessor";
import {
	AbstractControl,
	ControlContainer,
	NG_VALUE_ACCESSOR
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
	selector: "app-textarea",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<TextareaComponent> => TextareaComponent)
	}],
	template: `
				<textarea #textarea [attr.disabled]="disabled" placeholder="{{placeholder}}" [attr.maxlength]="maxLength"
				 [attr.title]="showTitle ? value : ''" [value]="value" (input)="onInput(textarea.value)"
				 [class.error]="showError" [attr.rows]="rows"></textarea>
	`,
	styleUrls: ["./textarea.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TextareaComponent extends BoxValueAccessor implements OnInit, OnDestroy {
	public value = "";
	@Input() public placeholder?: string;

	@Input()
	public set withTitle(value: boolean | "") {
		this.showTitle = value || value === "";
	}

	@Input()
	public set isDisabled(value: boolean) {
		this.disabled = value ? "" : null;
	}

	@Input() public maxLength?: number;
	@Input() public rows = 3;
	@Input() public formControlName?: string;
	@Input() public displayValidation = true;
	@Input() public error = false;
	@Input() public formControl?: AbstractControl;

	public disabled: "" | null = null;
	public showTitle = false;

	public showError = false;
	public control?: AbstractControl | null;

	public unsubscribe$$ = new Subject<void>();

	constructor(
		public readonly changeDetectorRef: ChangeDetectorRef,
		public readonly controlContainer: ControlContainer
	) {
		super();
	}

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

	public writeValue(value: string): void {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	public onInput(newValue: string): void {
		this.writeValue(newValue);
		if (this.onChange)
			this.onChange(newValue);
		if (this.onTouched)
			this.onTouched();
	}

	public setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
		this.changeDetectorRef.markForCheck();
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
