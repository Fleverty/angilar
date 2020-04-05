import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, createSelector, select } from "@ngrx/store";
import { CustomizationState } from "../../customization.reducer";
import { HelpContent } from "@helper/abstraction/sections";
import { Observable, Subject } from "rxjs";
import { map, filter, takeUntil } from "rxjs/operators";
import { notNull } from "@helper/operators";

@Component({
	selector: "app-help-content",
	templateUrl: "./help-content.component.html",
	styleUrls: ["./help-content.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HelpContentComponent {
	public id?: string;
	public activeHelpContent$: Observable<string | null>;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		private readonly store: Store<CustomizationState>,
	) {
		this.route.url.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(data => this.id = data[0].path);

		const content = (appState: any): CustomizationState => appState.customization;
		const selectContent = createSelector(content, (state: CustomizationState): HelpContent | undefined => state.activeHelpContent);
		this.activeHelpContent$ = this.store.pipe(
			select(selectContent),
			notNull(),
			filter(activeHelpContent => activeHelpContent.id === this.id),
			map(activeHelpContent => activeHelpContent.value && (activeHelpContent.value as string).replace(/\r\n/g, "\r\n\r\n"))); //if you have one '\r\n', your text in markdown not newline 
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
