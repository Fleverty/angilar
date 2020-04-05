import {
	ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnChanges, Output,
	SimpleChanges, Type, ChangeDetectorRef
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { TemplateUtil } from "@helper/template-util";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-multiselect-box",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef((): Type<MultiSelectBoxComponent> => MultiSelectBoxComponent)
	}],
	templateUrl: "./multiselect-box.component.html",
	styleUrls: ["./multiselect-box.component.scss"],
})

export class MultiSelectBoxComponent extends BoxValueAccessor implements OnChanges {
	@Input() public data: [any, string][] | HTMLElement = [];
	@Input() public valueTransformFn?: (value: any) => string;
	public list: [any, string][] = [];
	public expand = false;
	@Output() public appFilterChanges: EventEmitter<{ search: string }> = new EventEmitter<{ search: string }>();
	@Output() public appNextPage: EventEmitter<void> = new EventEmitter<void>();
	@Output() public appCollapse = new EventEmitter<void>();
	private templateUtil = TemplateUtil;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.data) {
			if (this.data instanceof Element || this.data instanceof HTMLDocument)
				this.list = this.templateUtil.getArray(this.data as HTMLElement);
			else if (Array.isArray(this.data)) {
				this.list = this.data.slice(0);
			}
			else
				throw Error("Invalid data format");
		}
	}

	public deleteItem(index: number, event: Event): void {
		event.stopPropagation();
		this.value.splice(index, 1);
		if (this.onChange)
			this.onChange(this.value);

		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}

	public addItem(item: [any, string]): void {
		if (!this.value) {
			this.value = [];
		}

		const itemExist: boolean = this.value.some((el: any) => el.id === item[0].id);
		if (!itemExist) {
			this.value.push(item[0]);
		}

		if (this.onChange)
			this.onChange(this.value);

		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}

	public writeValue(value: any): void {
		if (!value) {
			this.value = [];
		} else {
			this.value = value;
		}

		if (this.onChange)
			this.onChange(this.value);
		if (this.onTouched)
			this.onTouched();

		this.changeDetectorRef.markForCheck();
	}

	public onScrolled(): void {
		this.appNextPage.emit();
	}

	public expandList(flag: boolean): void {
		if (this.expand !== flag) {
			this.expand = flag;
			if (!this.expand) {
				this.appCollapse.emit();
			}
		}
	}

	public onInput(value: string): void {
		this.appFilterChanges.emit({ search: value });
	}
}
