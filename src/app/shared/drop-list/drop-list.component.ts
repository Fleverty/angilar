import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-drop-list",
	templateUrl: "./drop-list.component.html",
	styleUrls: ["./drop-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropListComponent implements OnInit {
	@Input() public tabs: [string, string][] = [];
	@Input() public isTriangle = true;
	@Output() public clickTab = new EventEmitter<string>();

	public ngOnInit(): void {
		if (!this.tabs) throw Error("No tabs.");
	}

	public emit(value: string): void {
		this.clickTab.emit(value);
	}
}
