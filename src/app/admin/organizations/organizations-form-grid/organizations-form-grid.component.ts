import { Component } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";

@Component({
	selector: "app-organizations-grid",
	templateUrl: "./organizations-form-grid.component.html",
	styleUrls: ["./organizations-form-grid.component.scss"]
})
export class OrganizationsFormGridComponent extends GridComponent {
	public clickId?: string;
}
