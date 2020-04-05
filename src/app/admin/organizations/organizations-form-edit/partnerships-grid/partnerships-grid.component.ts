import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-partnerships-grid",
	templateUrl: "./partnerships-grid.component.html",
	styleUrls: ["./partnerships-grid.component.scss"]
})
export class PartnershipsGridComponent extends GridComponent {
	public clickId?: string;
}
