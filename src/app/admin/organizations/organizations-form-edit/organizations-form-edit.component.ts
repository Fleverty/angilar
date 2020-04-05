import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-organizations-form-edit",
	templateUrl: "./organizations-form-edit.component.html",
	styleUrls: ["./organizations-form-edit.component.scss"]
})
export class OrganizationsFormEditComponent {
}
