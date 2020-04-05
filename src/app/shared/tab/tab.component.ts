import { ChangeDetectionStrategy, Component, forwardRef, Input, Type, ChangeDetectorRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<TabComponent> => TabComponent)
	}],
	selector: "app-tab",
	styleUrls: ["./tab.component.scss"],
	template: `
	<ng-content></ng-content>
	<app-tab-item [isActive]="tab[1]===value" (click)="setTab(tab[1])" *ngFor="let tab of tabs">{{tab[0]}}</app-tab-item>
	`
})
export class TabComponent implements ControlValueAccessor {
	@Input()
	public tabs: [string, any][] = [];
	public value: any;

	private onChange?: (...args: any[]) => void;
	private onTouched?: (...args: any[]) => void;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

	public writeValue(value: any): void {
		this.value = value ? value : this.tabs[0] && this.tabs[0][1];

		if (this.onChange && typeof this.onChange === "function")
			this.onChange(this.value);
		if (this.onTouched && typeof this.onTouched === "function")
			this.onTouched(this.value);
		this.changeDetectorRef.detectChanges();
	}

	public setTab(value: any): void {
		this.writeValue(value);
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
