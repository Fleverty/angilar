import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-connection-grid",
	templateUrl: "./connection-grid.component.html",
	styleUrls: ["./connection-grid.component.scss"]
})
export class ConnectionGridComponent extends GridComponent {
	public clickId?: string;
}
