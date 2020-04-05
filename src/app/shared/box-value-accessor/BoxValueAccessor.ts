import { ControlValueAccessor } from "@angular/forms";

export class BoxValueAccessor implements ControlValueAccessor {
	public value?: any;

	protected onChange?: (...args: any[]) => void;
	protected onTouched?: (...args: any[]) => void;

	public writeValue(value: any): void {
		this.value = value;
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
