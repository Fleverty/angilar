import { Directive, Input, OnInit } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[formControlName], [formControl]"
})
export class FieldNameToFormControlProviderDirective implements OnInit {
	@Input() public name?: string;
	constructor(private ngControl: NgControl) { }

	public ngOnInit(): void {
		// onsole.log(this.name, this.ngControl);
		if (this.ngControl.control)
			(this.ngControl.control as any).controlName = this.name;
	}
}
