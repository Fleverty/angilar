import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, forwardRef, Type, ChangeDetectorRef } from "@angular/core";
import { TemplateUtil } from "@helper/template-util";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<RadioButtonListComponent> => RadioButtonListComponent)
	}],
	selector: "app-radio-button-list",
	styleUrls: ["./radio-button-list.component.scss"],
	templateUrl: "./radio-button-list.component.html"
})

export class RadioButtonListComponent extends BoxValueAccessor implements OnChanges {
	@Input() public data: [string, string][] | HTMLElement = [];
	public list: [any, string][] = [];

	private templateUtil = TemplateUtil;

	constructor(
		private changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.data) {
			if (this.data instanceof Element || this.data instanceof HTMLDocument)
				this.list = this.templateUtil.getArray(this.data as HTMLElement);
			else if (Array.isArray(this.data))
				this.list = this.data.slice(0);
			else
				throw Error("Invalid data format");
			this.value = this.list[0][0];
		}
	}

	public checkItem(item: string): void {
		this.writeValue(item);
	}

	public writeValue(item: string): void {
		this.value = item;
		if (this.onChange)
			this.onChange(item);
		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}
}
