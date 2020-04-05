import { ChangeDetectionStrategy, Component, forwardRef, Type } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { TextboxComponent } from "@shared/textbox/textbox.component";

@Component({
	selector: "app-passwordbox",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<PasswordboxComponent> => PasswordboxComponent)
	}],
	template: `
	<input #input type="password" [value]="value" (input)="onInput(input.value)" placeholder="{{placeholder}}">`,
	styleUrls: ["./passwordbox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordboxComponent extends TextboxComponent { }
