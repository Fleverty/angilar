import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Store, createSelector, select } from "@ngrx/store";
import { CustomizationState } from "../../customization.reducer";
import { Observable, Subject } from "rxjs";
import { Partner } from "@helper/abstraction/partners";
import { getPartners, resetPartners } from "../../customization.actions";
import { TemplateUtil } from "@helper/template-util";
import { scanData, notNull } from "@helper/operators";
import { takeUntil } from "rxjs/operators";
import { DocumentProperty } from "@helper/abstraction/documents";

@Component({
	selector: "app-partners",
	templateUrl: "./partners.component.html",
	styleUrls: ["./partners.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersComponent implements AfterViewInit {
	public partners$: Observable<Partner[]>;
	public headProperties: DocumentProperty[] = [];
	public unsubscribe$$ = new Subject<void>();
	@ViewChild("headerProperties", { static: true, read: ElementRef }) private readonly propertiesTemplate?: ElementRef;

	private partnersLoaded = false;
	private size = 100;
	private page = 1;

	constructor(
		private readonly store: Store<CustomizationState>,
	) {
		const selectPartners = (appState: any): CustomizationState => appState.customization;
		const partnersSelector = createSelector(selectPartners, (data: CustomizationState) => data.partners);
		this.partners$ = this.store.pipe(
			select(partnersSelector),
			notNull(),
			scanData<Partner>(() => this.partnersLoaded = true),
			takeUntil(this.unsubscribe$$)
		);

		this.store.dispatch(getPartners({ page: this.page, size: this.size }));
	}

	public ngAfterViewInit(): void {
		if (!this.propertiesTemplate)
			throw Error("No propertiesTemplate");
		const parsedTemplate = TemplateUtil.getNestedStructure(this.propertiesTemplate.nativeElement);
		this.headProperties = Object.keys(parsedTemplate).map(e => parsedTemplate[e]);
	}

	public ngOnDestroy(): void {
		this.store.dispatch(resetPartners());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public nextPage(): void {
		if (!this.partnersLoaded) {
			this.page += 1;
			this.store.dispatch(getPartners({ page: this.page, size: this.size }));
		}
	}
}
