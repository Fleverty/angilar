import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	Input,
	Type
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { TextboxComponent } from "../textbox/textbox.component";

export type NumberType = "int" | "float";

@Component({
	selector: "app-numberbox",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<NumberboxComponent> => NumberboxComponent)
	}],
	template: `
        <input #input [class.error]="showError" type="text" [attr.maxlength]="maxLength" [value]="value" [attr.disabled]="disabled"
               (input)="inputValidator($event)" placeholder="{{placeholder}}">
	`,
	styleUrls: ["./numberbox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberboxComponent extends TextboxComponent {
	@Input() public type: NumberType = "int";
	@Input() public isDisabled = false;
	@Input() public wholeMaxLength?: number;
	@Input() public decimalMaxLength?: number;
	@Input() public disableAutoCheck = false;
	@Input() public withEmptyNull = false;

	public value = "";
	private previousValue = "";

	public inputValidator(event: any): void {
		if (this.type === "float")
			this.inputValidatorFloat(event);
		else
			this.inputValidatorInt(event);
	}

	public inputValidatorInt(event: any): void {
		const pattern = /^[0-9]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = this.previousValue;
		} else {
			this.previousValue = event.target.value;
		}
		this.writeValue(event.target.value);
		if (this.onChange)
			this.onChange(event.target.value);
		if (this.onTouched)
			this.onTouched();
	}

	public inputValidatorFloat(event: any): void {
		if (this.wholeMaxLength && this.decimalMaxLength && this.maxLength) {
			const decimalPattern = new RegExp(`^[0-9]{0,${this.wholeMaxLength}}([.][0-9]{0,${this.decimalMaxLength}})?$`);
			const nullWithDotPattern = new RegExp(`^[0-9]{1,${this.wholeMaxLength}}([.][0-9]{0,${this.decimalMaxLength}})?$`);
			const autoDotPattern = new RegExp(`^[0-9]{0,${this.wholeMaxLength + 1}}([.][0-9]{0,${this.decimalMaxLength}})?$`);

			if (!decimalPattern.test(event.target.value)) {
				if (autoDotPattern.test(event.target.value)) {
					event.target.value = event.target.value.slice(0, this.wholeMaxLength) + "." + event.target.value.slice(this.wholeMaxLength, this.maxLength - 1);
					this.previousValue = event.target.value;
				} else {
					event.target.value = this.previousValue;
				}
			} else {
				if (this.previousValue === "0") {
					event.target.value = event.target.value.slice(1, event.target.value.length);
				}
				if (event.target.value === "" && this.withEmptyNull)
					event.target.value = null;
				if ((!nullWithDotPattern.test(event.target.value) && !this.withEmptyNull) || event.target.value === "." || event.target.value[0] === ".") {
					event.target.value = "0" + event.target.value.slice(0, event.target.value.length);
				}
				this.previousValue = event.target.value;
			}
		}
		this.writeValue(event.target.value);
		if (this.onChange)
			this.onChange(event.target.value);
		if (this.onTouched)
			this.onTouched();
	}
}
