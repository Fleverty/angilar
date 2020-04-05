import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-text-materials",
	templateUrl: "./text-materials.component.html",
	styleUrls: ["./text-materials.component.scss"]
})
export class TextMaterialsComponent {

}
