import { Directive, ElementRef } from "@angular/core";
import { NgControl, FormControl } from "@angular/forms";

export interface ExtendedFormControl extends FormControl {
	nativeElement?: HTMLFormElement;
}

@Directive({
	selector: "[formControl], [formControlName]"
})
export class NativeElementToFormControlProviderDirective {
	constructor(
		public ngControl: NgControl,
		public elementRef: ElementRef<HTMLFormElement>) {
	}

	public ngOnInit(): void {
		if (this.ngControl.control)
			(this.ngControl.control as any).nativeElement = this.elementRef.nativeElement;
	}
}
