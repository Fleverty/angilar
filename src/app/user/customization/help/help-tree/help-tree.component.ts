import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { SectionList } from "@helper/abstraction/sections";
import { CustomizationState } from "../../customization.reducer";
import { Store } from "@ngrx/store";
import { setActiveHelpId } from "../../customization.actions";
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-help-tree",
	styleUrls: ["./help-tree.component.scss"],
	templateUrl: "./help-tree.component.html"
})

export class HelpTreeComponent {
	@Input() public nodes?: SectionList[];
	@Input() public priority?: number;
	@Input() public activeHelpId?: string;

	constructor(
		private readonly store: Store<CustomizationState>
	) {
	}

	public goLink(id: string, event: any): void {
		this.store.dispatch(setActiveHelpId(id));
		event.stopPropagation();
	}
}
