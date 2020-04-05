import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";
import { Partner } from "@helper/abstraction/partners";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-partners-grid",
	templateUrl: "./partners-grid.component.html",
	styleUrls: ["./../../../../shared/grid/grid.component.scss", "./partners-grid.component.scss"]
})
export class PartnersGridComponent extends GridComponent<Partner> {
}
