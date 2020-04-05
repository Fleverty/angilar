import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";
import { Storage } from "@helper/abstraction/storages";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-storages-grid",
	templateUrl: "./storages-grid.component.html",
	styleUrls: ["./storages-grid.component.scss", "./../../../../shared/grid/grid.component.scss"]
})
export class StoragesGridComponent extends GridComponent<Storage> {
	@Input() public items: Storage[] = [];
	@Output() public appDeleteStorages: EventEmitter<Storage[]> = new EventEmitter<Storage[]>();

	public clickId?: number;
	public deleteStorageHandler(event: MouseEvent, storage: Storage): void {
		event.stopPropagation();
		this.appDeleteStorages.emit([storage]);
	}
}
