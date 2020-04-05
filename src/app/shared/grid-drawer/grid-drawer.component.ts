import {
	ChangeDetectionStrategy, Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef,
	TrackByFunction
} from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-grid-drawer",
	styleUrls: ["./grid-drawer.component.scss"],
	templateUrl: "./grid-drawer.component.html"
})
export class GridDrawerComponent implements OnChanges {
	@Input() public columns?: number;
	@Input() public rows?: number;
	@Input() public items: any[];
	@Input() public itemIdentity?: TrackByFunction<any>;
	@ContentChild("itemTemplate", { static: false }) public itemTemplate?: TemplateRef<any>;
	private size = [1, 1];

	constructor(private readonly sanitizer: DomSanitizer) {
		const items: number[] = [];
		for (let i = 1; i < 32; i++)
			items.push(i);
		this.items = items;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.columns || changes.rows || changes.items)
			this.size = this.calculateSize();
	}

	public get gridTemplateColumns(): SafeStyle {
		return this.sanitizer.bypassSecurityTrustStyle(`repeat(${this.size[0]}, 1fr)`);
	}

	public get gridTemplateRows(): SafeStyle {
		return this.sanitizer.bypassSecurityTrustStyle(`repeat(${this.size[1]}, 1fr)`);
	}

	private calculateSize(): [number, number] {
		if (this.columns && this.rows)
			return [this.columns, this.rows];

		if (this.items && this.items.length) {
			if (this.columns)
				return [this.columns, Math.ceil(this.items.length / this.columns)];
			else if (this.rows)
				return [Math.ceil(this.items.length / this.rows), this.rows];
		}
		return [1, 1];
	}
}
