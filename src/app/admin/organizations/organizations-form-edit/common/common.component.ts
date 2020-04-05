import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./common.component.html",
	styleUrls: ["./common.component.scss"]
})
export class CommonComponent {
}
