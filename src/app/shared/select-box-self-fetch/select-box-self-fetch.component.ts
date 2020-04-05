import { Component, ChangeDetectionStrategy, forwardRef, Type, HostBinding, ChangeDetectorRef, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlContainer } from "@angular/forms";
import { takeUntil, take, map, debounceTime } from "rxjs/operators";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { TemplateUtil } from "@helper/template-util";
import { DefaultFormControl } from "@shared/default-form-control/default-form-control";

export interface SelectBoxSelfFetchState {
	[key: string]: any;
	page: number;
	size: number;
	search?: string;
}

export interface SelfFetchOption<T> {
	getInitialState: () => SelectBoxSelfFetchState;
	nextChunk: (state: SelectBoxSelfFetchState) => SelectBoxSelfFetchState; // if search exist, it must be considered
	getData$?: (state: SelectBoxSelfFetchState) => Observable<T>;
	mapData?: (data: T) => [any, string][];
}


@Component({
	selector: "app-select-box-self-fetch",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		multi: true,
		useExisting: forwardRef(<T>(): Type<SelectBoxSelfFetchComponent<T>> => SelectBoxSelfFetchComponent)
	}],
	templateUrl: "./select-box-self-fetch.component.html",
	styleUrls: ["./select-box-self-fetch.component.scss", "../selectbox/selectbox.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectBoxSelfFetchComponent<T> extends DefaultFormControl implements OnChanges, OnDestroy, AfterViewInit {
	@HostBinding("attr.disabled") public disabled: null | "" = null;
	@ViewChild("preset", { static: true, read: ElementRef }) public set preset(elementRef: ElementRef<HTMLElement>) {
		this.presetData = TemplateUtil.getArray(elementRef.nativeElement);
	}
	@Input() public showSearch = true;
	@Input() public placeholder?: string;
	@Input("option") public selfFetchOption: SelfFetchOption<T>;
	@Input() public set otherEmptyValue(element: HTMLElement) {
		this.presetData = TemplateUtil.getArray(element);
	}
	public textValue?: string;
	public expand = false;
	public data: [any, string][] = [];
	public presetData: [any, string][] = [];
	public value: any | null = null;
	public selected?: [any, string]; //todo: refactor selected
	public input$$ = new Subject<string>();
	private initialState: SelectBoxSelfFetchState = { page: 1, size: 30 };
	private state$$: BehaviorSubject<SelectBoxSelfFetchState>;
	private stateTracker$$?: Subject<void>;
	private defaultOption: SelfFetchOption<T> = {
		getInitialState: (): SelectBoxSelfFetchState => ({ ...this.initialState }),
		nextChunk: (state): SelectBoxSelfFetchState => ({ ...state, page: state.page + 1 })
	};

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		controlContainer: ControlContainer,
	) {
		super(controlContainer, changeDetectorRef);
		this.selfFetchOption = { ...this.defaultOption };
		this.state$$ = new BehaviorSubject<SelectBoxSelfFetchState>(this.selfFetchOption.getInitialState());
		this.input$$.pipe(
			debounceTime(250),
			takeUntil(this.unsubscribe$$)
		).subscribe(text => this.onInput(text));
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.selfFetchOption && simpleChanges.selfFetchOption.currentValue) {
			// if not pass required function use default
			this.selfFetchOption = { ...this.defaultOption, ...this.selfFetchOption };
		}
	}

	public ngAfterViewInit(): void {
		this.setData(this.data);
		this.writeValue(this.value);
		this.changeDetectorRef.detectChanges();
	}

	public writeValue(value: any): void {
		if (value === undefined) {
			value = null;
		}
		this.value = value;
		this.selected = this.data.find(e => e[0] === value) || value && this.transform(value);
	}

	public select(item: [any, string]): void {
		this.writeValue(item[0]);
		this.selected = item.slice(0) as [any, string]; // new instance !
		this.collapse();
		if (this.onChange)
			this.onChange(item[0]);
		this.changeDetectorRef.markForCheck();
	}

	public onInput(search: string): void {
		this.resetData();
		this.cleanStateTracker();
		const newState = { ...this.selfFetchOption.getInitialState(), search };
		this.state$$.next(newState);
		this.stateTracker$$ = this.trackState$$();
	}

	public onScrolled(): void {
		this.state$$.next(this.selfFetchOption.nextChunk(this.state$$.value));
	}

	public onClickOutside(): void {
		if (this.expand)
			this.collapse();
	}

	public collapse(): void {
		this.expand = false;
		this.cleanStateTracker();
		this.resetData();
	}

	public unfold(): void {
		this.expand = true;
		this.state$$.next(this.selfFetchOption.getInitialState());
		this.stateTracker$$ = this.trackState$$();
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled ? "" : null;
		this.changeDetectorRef.markForCheck();
	}

	public ngOnDestroy(): void {
		this.cleanStateTracker();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private trackState$$(): Subject<void> {
		const unsubscribe$$ = new Subject<void>();
		this.state$$.pipe(
			takeUntil(this.unsubscribe$$),
			takeUntil(unsubscribe$$)
		).subscribe(state => {
			if (!this.selfFetchOption.getData$)
				throw Error("No getData$ using for enrich date");

			this.selfFetchOption.getData$(state).pipe(
				take(1),
				map(data => this.selfFetchOption.mapData ? this.selfFetchOption.mapData(data) : data as any),
				takeUntil(this.unsubscribe$$),
				takeUntil(unsubscribe$$)
			).subscribe(data => {
				if (Array.isArray(data) && !data.length) {
					unsubscribe$$.next();
					unsubscribe$$.complete();
				}
				this.appendData(data);
				this.changeDetectorRef.detectChanges();
			});
		});
		return unsubscribe$$;
	}

	private cleanStateTracker(): void {
		if (this.stateTracker$$) {
			this.stateTracker$$.next();
			this.stateTracker$$.complete();
			delete this.stateTracker$$;
		}
	}

	private transform(value: any): [any, string] {
		if (this.selfFetchOption.mapData) {
			const data = this.selfFetchOption.mapData([value] as any as T);
			if (data.length)
				return data[0];
		}
		return [value, value]; // todo: write call transform fn here
	}

	private resetData(): void {
		this.data = [...this.presetData];
	}

	private appendData(newData: [any, string][]): void {
		this.data = [...this.data, ...newData];
	}

	private setData(newData: [any, string][]): void {
		this.data = [...this.presetData, ...newData];
	}
}
