import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

import {
	Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from "@angular/core";
import { FormGroupDirective } from "@angular/forms";

@Directive({
	selector: "[appFormValueChanges]"
})
export class FormValueChangesDirective implements OnChanges, OnDestroy {
	@Input() public formGroup?: FormGroupDirective;
	@Output("appFormValueChanges") public valueChanges = new EventEmitter<any>();
	private readonly unsubscribe$$ = new Subject<void>();

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.formGroup) {
			this.unsubscribe$$.next();

			if (this.formGroup) {
				if (!this.formGroup.valueChanges)
					throw Error("valueChanges");
				this.formGroup.valueChanges.pipe(
					takeUntil(this.unsubscribe$$),
					filter((): boolean => !!this.formGroup && !!this.formGroup.dirty)
				).subscribe((e): void => this.valueChanges.next(e));
			}
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
