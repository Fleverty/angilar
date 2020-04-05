import { Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { Document } from "@helper/abstraction/documents";
import { notNull } from "@helper/operators";
import { TemplateUtil } from "@helper/template-util";
import { createSelector, select, Store } from "@ngrx/store";
import { DocumentsState } from "../documents.reducer";
import { exportXMLDocuments, exportXLSXDocuments } from "@app/user/user.actions";

@Component({
	selector: "app-einvoice-action",
	templateUrl: "./einvoice-action.component.html",
	styleUrls: ["./einvoice-action.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EinvoiceActionComponent implements OnInit, OnDestroy {
	public isShowList = false;
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public tabs: [string, string][] = [];
	public selectedItems$: Observable<Document[] | undefined>;
	public unsubscribe$$ = new Subject<void>();
	public selectIds: number[] = [];
	public activeDocumentState?: string;
	constructor(
		private overlayService: OverlayService,
		private route: ActivatedRoute,
		private router: Router,
		private readonly store: Store<DocumentsState>,
		private changeDetectorRef: ChangeDetectorRef,
	) {
		const section = (appState: any): DocumentsState => appState.documents;
		const selectedItems = createSelector(section, (state: DocumentsState): Document[] | undefined => state.selectedItems);
		this.selectedItems$ = this.store.pipe(select(selectedItems));

		this.activeDocumentState = this.router.url.split("?")[0].split("/")[4];

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			takeUntil(this.unsubscribe$$)
		).subscribe((e: Event) => {
			this.activeDocumentState = (e as NavigationEnd).url.split("?")[0].split("/")[4];
			this.changeDetectorRef.detectChanges();
		});
	}

	public isActive(): string {
		const routes = this.router.url.split("?")[0].split("/");
		return routes[routes.length - 1];
	}

	public create(): void {
		const queryParams = { draftType: "BLRINV" };
		this.router.navigate(["create"], { queryParams, relativeTo: this.route });
	}

	public ngOnInit(): void {
		this.selectedItems$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(selectedItems => {
			this.selectIds = selectedItems.map(e => +e.id);
		});
	}

	public export(type: string): void {
		if (type === "xml")
			this.store.dispatch(exportXMLDocuments({
				documentType: "BLRINV",
				documentIds: this.selectIds
			}));

		if (type === "xlsx")
			this.store.dispatch(exportXLSXDocuments({
				documentType: "EINVOICE",
				documentIds: this.selectIds
			}));
	}

	public showList(): void {
		if (this.selectIds.length > 0)
			this.isShowList = !this.isShowList;
	}

	public ngOnDestroy(): void {
		this.overlayService.clear();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
