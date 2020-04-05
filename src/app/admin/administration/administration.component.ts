import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-administration",
	templateUrl: "./administration.component.html",
	styleUrls: ["./administration.component.scss"]
})
export class AdministrationComponent {

}
