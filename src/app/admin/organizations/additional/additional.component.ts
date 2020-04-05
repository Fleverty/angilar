import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./additional.component.html",
	styleUrls: ["./additional.component.scss"]
})
export class AdditionalComponent {

}
