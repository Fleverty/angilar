import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-organizations",
	templateUrl: "./organizations.component.html",
	styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent {

}
