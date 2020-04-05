import { Component, forwardRef, ChangeDetectionStrategy, Type, Input, ChangeDetectorRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, FormControl, FormGroup } from "@angular/forms";
import { BoxValueAccessor } from "@shared/box-value-accessor/BoxValueAccessor";

@Component({
	selector: "app-optional-custom-field",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<OptionalCustomFieldComponent> => OptionalCustomFieldComponent)
	}],
	templateUrl: "./optional-custom-field.component.html",
	styleUrls: ["./optional-custom-field.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class OptionalCustomFieldComponent extends BoxValueAccessor {
	@Input() public title?: string;
	@Input() public maxLength?: number;
	@Input() public control?: FormControl | FormGroup;
	public isShowField = false;

	constructor(
		private changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}

	public delete(): void {
		this.isShowField = false;
		if (this.control) {
			this.control.reset();
		}
	}

	public hasValue(): boolean {
		if (this.control) {
			if (this.control instanceof FormControl) {
				return !!this.control.value;
			} else {
				let flag = false;
				for (const field in this.control.controls) { // 'field' is a string
					flag = flag || !!this.control.controls[field].value;
				}
				return flag;
			}
		} else {
			return false;
		}
	}

	// public writeValue(value: any): void {
	// 	console.log(value);
	// 	this.value = value;
	// 	if (this.onChange)
	// 		this.onChange(value);
	// 	if (this.onTouched)
	// 		this.onTouched();
	// 	this.changeDetectorRef.markForCheck();
	// }
}
