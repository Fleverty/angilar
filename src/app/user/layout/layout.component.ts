import {
	ChangeDetectionStrategy,
	Component,
} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-layout",
	styleUrls: ["./layout.component.scss"],
	templateUrl: "./layout.component.html"
})
export class LayoutComponent { }
