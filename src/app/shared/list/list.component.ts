import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
	selector: "app-list",
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements AfterViewInit {
	@Input() public showSearch = true;
	@Input() public data: [any, string][] = [];
	@Output() public appInput = new EventEmitter<string>();
	@Output() public appSelect = new EventEmitter<[any, string]>();
	@Output() public appScrolled = new EventEmitter<number>();
	@ViewChild("input", { static: true }) public input?: ElementRef<HTMLInputElement>;
	public list: [any, string][] = [];

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.data)
			this.list = this.data.slice(0);
	}

	public ngAfterViewInit(): void {
		this.input && this.input.nativeElement.focus();
	}

	public onInput(value: string): void {
		value = value.toLocaleLowerCase();
		if (value !== "")
			this.list = this.data.filter((item): boolean => item[1].toLocaleLowerCase().includes(value));
		else
			this.list = this.data.slice(0);
		this.appInput.emit(value);
	}

	public select(item: [any, string]): void {
		this.appSelect.emit(item);
	}

	public onScroll(scrollHeight: number, scrollTop: number, height: number): void {
		if (scrollTop + height >= scrollHeight)
			this.appScrolled.emit(scrollHeight);
	}
}
