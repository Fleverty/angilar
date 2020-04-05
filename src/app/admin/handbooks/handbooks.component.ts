import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-handbooks",
	templateUrl: "./handbooks.component.html",
	styleUrls: ["./handbooks.component.scss"]
})
export class HandbooksComponent {

}
