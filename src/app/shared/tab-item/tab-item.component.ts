import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-tab-item",
	styleUrls: ["./tab-item.component.scss"],
	template: "<ng-content></ng-content>"
})
export class TabItemComponent {
	@HostBinding("class.active")
	@Input() public isActive = false;
}
