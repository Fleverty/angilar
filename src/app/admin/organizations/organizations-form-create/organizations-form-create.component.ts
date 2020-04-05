import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-organizations-form-create",
	templateUrl: "./organizations-form-create.component.html",
	styleUrls: ["./organizations-form-create.component.scss"]
})
export class OrganizationsFormCreateComponent {

}
