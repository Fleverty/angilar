import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Event } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil, filter, skipUntil } from "rxjs/operators";
import { Store, createSelector, select } from "@ngrx/store";
import { CustomizationState } from "../customization.reducer";
import { getHelpLists, setActiveHelpId, resetActiveHelpId } from "../customization.actions";
import { SectionList } from "@helper/abstraction/sections";
import { notNull } from "@helper/operators";


@Component({
	selector: "app-help",
	templateUrl: "./help.component.html",
	styleUrls: ["./help.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class HelpComponent {
	public sectionList$: Observable<SectionList[]>;
	public helpLinks: { text: string; id?: string }[] = [];
	public activeHelpId$?: Observable<string | undefined>;
	private unsubscribe$$ = new Subject<void>();
	private flatTreeIds: string[] = [];
	private previousId?: string;
	private nextId?: string;
	private readonly urlString: string = "/user/customization/help/";

	constructor(
		private readonly store: Store<CustomizationState>,
		public readonly router: Router,
		public readonly activatedRoute: ActivatedRoute
	) {
		this.store.dispatch(getHelpLists());
		const section = (appState: any): CustomizationState => appState.customization;
		const sectionList = createSelector(section, (state: CustomizationState): SectionList[] => state.sectionList);
		const activeHelpIdSelector = createSelector(section, (state: CustomizationState): string | undefined => state.activeHelpId);

		this.sectionList$ = this.store.pipe(
			select(sectionList),
			filter(e => e && !!e.length),
		);

		this.activeHelpId$ = this.store.pipe(
			select(activeHelpIdSelector)
		);

		this.sectionList$.pipe(notNull(), takeUntil(this.unsubscribe$$)).subscribe((value: SectionList[]) => this.flatArray(value[0].children || []));


		this.activeHelpId$.pipe(
			skipUntil(this.sectionList$),
			takeUntil(this.unsubscribe$$)
		).subscribe((id) => {
			if (id) {
				this.router.navigateByUrl(`${this.urlString + id}`);
				const activeIdIndex: number = this.flatTreeIds.indexOf(id);
				if (activeIdIndex >= 0) {
					this.previousId = this.flatTreeIds[activeIdIndex - 1];
					this.nextId = this.flatTreeIds[activeIdIndex + 1];
				}
			}
		});

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			takeUntil(this.unsubscribe$$)
		).subscribe((e: Event) => {
			const activeHelpId = (e as NavigationEnd).url.split("/")[4];
			if (activeHelpId) {
				this.store.dispatch(setActiveHelpId(activeHelpId));
			} else {
				this.store.dispatch(resetActiveHelpId());
			}
		});
	}

	public clickPrevious(): void {
		if (this.previousId) {
			this.store.dispatch(setActiveHelpId(this.previousId));
		}
	}

	public clickNext(): void {
		if (this.nextId) {
			this.store.dispatch(setActiveHelpId(this.nextId));
		}
	}

	public ngOnDestroy(): void {
		this.store.dispatch(resetActiveHelpId());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	// TODO BAHATKA REFACTOR
	private flatArray(arr: SectionList[]): void {
		arr.forEach((value: SectionList) => {
			if (!value.children || !value.children.length) {
				this.flatTreeIds.push(value.id);
			} else {
				this.flatTreeIds.push(value.id);
				return this.flatArray(value.children);
			}
		});
	}
}
