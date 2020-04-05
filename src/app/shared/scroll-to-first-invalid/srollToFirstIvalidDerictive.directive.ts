import { Directive, Input, HostListener, OnChanges } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { ExtendedFormControl } from "@shared/native-element-to-form-control-provider/native-element-to-form-control-provider.directive";

@Directive({
	selector: "[appSrollToFirstIvalidDerictive]"
})
export class ScrollToFirstInvalidDirective implements OnChanges {
	@Input() public formGroup?: FormGroup;
	@Input() public appSrollToFirstIvalidDerictive?: HTMLElement;

	@HostListener("submit", ["$event"]) public onSubmit(target: any): void {
		target.preventDefault();
		if (this.formGroup && this.formGroup.invalid) {
			const firstIvalidControl = this.findTarget(this.formGroup);
			if (firstIvalidControl) {
				const ne = (firstIvalidControl as ExtendedFormControl).nativeElement;
				if (!ne)
					throw Error("No nativeElement element at control");
				ne.scrollIntoView({ behavior: "smooth" });
			}
		}
	}

	public ngOnChanges(): void {
		if (!this.formGroup)
			throw Error("No formGroup");
	}

	private findTarget(fgOrFc: FormGroup | FormControl | FormArray): FormControl | null {
		if (fgOrFc instanceof FormGroup || fgOrFc instanceof FormArray) {
			for (const key in fgOrFc.controls) {
				const control = this.findTarget((fgOrFc.controls as any)[key] as FormGroup | FormControl);
				if (control) {
					return control;
				}

			}
			return null;
		} else {
			return fgOrFc.invalid ? fgOrFc as FormControl : null;
		}
	}
}
