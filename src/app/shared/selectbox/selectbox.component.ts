import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	Type,
	ChangeDetectorRef,
	ElementRef,
	ViewChild,
	ChangeDetectionStrategy,
	HostBinding,
	OnInit,
	OnDestroy
} from "@angular/core";
import { TemplateUtil } from "@helper/template-util";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";
import { AbstractControl, ControlContainer, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-selectbox",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<SelectboxComponent> => SelectboxComponent)
	}],
	templateUrl: "./selectbox.component.html",
	styleUrls: ["./selectbox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectboxComponent extends BoxValueAccessor implements OnChanges, OnInit, OnDestroy {
	@Input() public showSearch = true;
	@Input() public placeholder?: string;
	@Input() public set otherEmptyValue(element: HTMLElement) {
		this.presetValues = TemplateUtil.getArray(element);
	}
	@ViewChild("emptyValue", { static: true, read: ElementRef }) public set valueMap(elementRef: ElementRef<HTMLElement>) {
		this.presetValues = TemplateUtil.getArray(elementRef.nativeElement);
	}
	@Input() public data: [any, string][] | HTMLElement | null = null;
	@Input() public valueTransforFn?: (value: any) => string;
	@Input() public set isDisabled(value: boolean) {
		this.disabled = value ? "" : null; //todo: remove it
	}
	@Input() public formControlName?: string;
	@Input() public displayValidation = true;
	@Input() public formControl?: AbstractControl;
	// Fux changeDetection on init (doesnt't work)
	@HostBinding("attr.disabled") public disabled: null | "" = null;
	@Output() public appNextPage = new EventEmitter<void>();
	@Output() public appFilterChanges = new EventEmitter<{ search: string }>();
	@Output() public appCollapse = new EventEmitter<void>();

	public expand = false;
	public presetValues: [any, string][] = [];
	public list: [any, string][] = [];
	public selected?: [any, string];
	public get textValue(): string {
		return Array.isArray(this.selected) ? this.selected[1] : this.savedValue;
	}
	public templateUtil = TemplateUtil;
	public showError = false;
	public control?: AbstractControl | null;
	public unsubscribe$$ = new Subject<void>();
	private savedValue: any;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		public readonly controlContainer: ControlContainer
	) {
		super();
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.data) {
			if (this.data instanceof Element || this.data instanceof HTMLDocument)
				this.list = this.presetValues.reduce((acc, value) => [value, ...acc], this.templateUtil.getArray(this.data as HTMLElement));
			else if (Array.isArray(this.data))
				this.list = this.presetValues.reduce((acc, value) => [value, ...acc], this.data.slice(0));
			else if (this.data !== null)
				throw Error("Invalid data format");

			if (this.savedValue !== undefined) {

				const item = this.findByValue(this.savedValue);
				if (item) {
					this.value = item[0];
					this.selected = item.slice(0) as [any, string];
					this.changeDetectorRef.detectChanges();
					delete this.savedValue;
				}
			}
		}
	}

	public ngOnInit(): void {
		if (!this.displayValidation)
			return;

		if (this.formControl)
			this.control = this.formControl;

		if (this.controlContainer && this.formControlName && this.controlContainer.control)
			this.control = this.controlContainer.control.get(this.formControlName);

		// Subscribe need to change control touched state
		this.control && this.control.statusChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			this.showError = this.control && this.control.touched && this.control.invalid || false;
			this.changeDetectorRef.detectChanges();
		});
	}

	public writeValue(value: any, withTransform = true): void {
		if (!value) {
			this.value = null;
			this.selected = Array.isArray(this.presetValues) && this.presetValues.length === 1 ? this.presetValues[0] : undefined;
			this.savedValue = null;
			this.changeDetectorRef.detectChanges();
			return;
		}
		const item: [any, string] = this.valueTransforFn && withTransform ?
			this.valueTransforFn(value) :
			this.findByValue(value);

		if (item) {
			this.value = item[0];
			this.selected = item.slice(0) as [any, string];
		} else {
			this.savedValue = value;
			this.selected = undefined;
		}
		this.changeDetectorRef.detectChanges();
	}

	public select(item: [any, string]): void {
		this.writeValue(item[0], false);
		if (this.onChange)
			this.onChange(item[0]);
		this.selected = item.slice(0) as [any, string];
		this.collapse();
		this.changeDetectorRef.markForCheck();
	}

	public onScrolled(): void {
		this.appNextPage.emit();
	}

	public onInput(value: string): void {
		this.appFilterChanges.emit({ search: value });
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled ? "" : null;
		this.changeDetectorRef.markForCheck();
	}

	public onClickOutside(): void {
		if (this.expand)
			this.collapse();
	}

	public collapse(): void {
		this.expand = false;
		this.appCollapse.emit();
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private findByValue(value: any): any | undefined {
		return this.list.find(e => e[0] === value);
	}
}
