import { ChangeDetectionStrategy, Component, forwardRef, Input, Type, ChangeDetectorRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";

@Component({
	selector: "app-rangebox",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<RangeboxComponent> => RangeboxComponent)
	}],
	templateUrl: "./rangebox.component.html",
	styleUrls: ["./rangebox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeboxComponent extends BoxValueAccessor {
	@Input() public placeholder?: string;
	public expand = false;
	public value?: [Date, Date];

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	public writeValue(value: [Date, Date]): void {
		this.value = value;
		if (this.onChange)
			this.onChange(value);
		this.changeDetectorRef.markForCheck();
	}

	public selectRange(range?: [Date, Date]): void {
		if (Array.isArray(range) && + range[0] <= +range[1])
			this.writeValue(range);
		this.expand = false;
	}

	public isArray(arr?: any): boolean {
		return Array.isArray(arr);
	}
}
