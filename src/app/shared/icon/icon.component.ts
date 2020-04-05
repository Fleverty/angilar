import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-icon",
	template: "<ng-content></ng-content>",
	styleUrls: ["./icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
}
