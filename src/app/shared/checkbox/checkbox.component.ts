import {
	ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostListener, Output, Type
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";

@Component({
	selector: "app-checkbox",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<CheckboxComponent> => CheckboxComponent)
	}],
	template: `
	<app-icon>{{ value ? "check_box" : "check_box_outline_blank" }}</app-icon>
	`,
	styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent extends BoxValueAccessor {
	public value = false;

	@Output()
	public change = new EventEmitter<boolean>();

	public writeValue(value: boolean): void {
		this.value = value;
	}

	@HostListener("click")
	public click(): void {
		this.value = !this.value;
		if (this.onChange)
			this.onChange(this.value);
		this.change.emit(this.value);
	}
}
