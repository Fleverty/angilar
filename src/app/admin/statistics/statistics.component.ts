import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-statistics",
	templateUrl: "./statistics.component.html",
	styleUrls: ["./statistics.component.scss"]
})
export class StatisticsComponent {

}
