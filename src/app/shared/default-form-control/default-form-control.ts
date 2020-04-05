import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";
import { OnInit, Input, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { AbstractControl, ControlContainer } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

export class DefaultFormControl extends BoxValueAccessor implements OnInit, OnDestroy {
	@Input() public formControlName?: string;
	@Input() public formControl?: AbstractControl;
	@Input() public displayValidation = true;
	public control?: AbstractControl | null;
	public showError = false;

	protected unsubscribe$$ = new Subject<void>();

	constructor(
		protected readonly controlContainer: ControlContainer,
		protected readonly changeDetectorRef: ChangeDetectorRef
	) { super(); }

	public ngOnInit(): void {
		if (!this.displayValidation)
			return;

		if (this.formControl)
			this.control = this.formControl;

		if (this.controlContainer && this.formControlName && this.controlContainer.control)
			this.control = this.controlContainer.control.get(this.formControlName);

		// Subscribe need to change control touched state
		if (this.control) {
			this.control.statusChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
				this.showError = this.control && this.control.touched && this.control.invalid || false;
				this.changeDetectorRef.detectChanges();
			});
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
