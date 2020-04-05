import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { TemplateUtil } from "@helper/template-util";
import { OverlayService } from "@core/overlay.service";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { createSelector, Store } from "@ngrx/store";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { Subject, Observable } from "rxjs";
import { Document, DocumentState } from "@helper/abstraction/documents";
import { filter, takeUntil } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { exportXLSXDocuments, exportXMLDocuments } from "@app/user/user.actions";

@Component({
	selector: "app-einvoicepmt-action",
	templateUrl: "./einvoicepmt-action.component.html",
	styleUrls: ["./einvoicepmt-action.component.scss"]
})
export class EinvoicepmtActionComponent {
	public isShowList = false;
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public tabs: [string, string][] = [];
	public readonly documentState$: Observable<DocumentState | undefined>;
	public readonly selectedItems$: Observable<Document[]>;
	public unsubscribe$$ = new Subject<void>();
	public selectIds: number[] = [];
	public activeDocumentState?: string;
	constructor(
		private overlayService: OverlayService,
		private route: ActivatedRoute,
		private router: Router,
		private readonly store: Store<DocumentsState>,
		private changeDetectorRef: ChangeDetectorRef
	) {
		const selectDocumentsState = (appState: any): DocumentsState => appState.documents;
		const selectDocumentState = createSelector(selectDocumentsState, (state: DocumentsState): DocumentState | undefined => state.filter && state.filter.documentState);
		const selectSelectedItems = createSelector(selectDocumentsState, (state: DocumentsState): Document[] => state.selectedItems || []);
		this.documentState$ = this.store.select(selectDocumentState);
		this.selectedItems$ = this.store.select(selectSelectedItems);

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
		this.router.navigate(["create"], { relativeTo: this.route });
	}

	public ngOnInit(): void {
		this.selectedItems$.pipe(
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(selectedItems => {
			this.selectIds = selectedItems.map(e => +e.id);
			this.changeDetectorRef.detectChanges();
		});
	}

	public export(type: string): void {
		if (type === "xml")
			this.store.dispatch(exportXMLDocuments({
				documentType: "BLRPMT",
				documentIds: this.selectIds
			}));

		if (type === "xlsx")
			this.store.dispatch(exportXLSXDocuments({
				documentType: "EINVOICEPMT",
				documentIds: this.selectIds
			}));
	}

	public showList(): void {
		if (this.selectIds.length > 0)
			this.isShowList = !this.isShowList;
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
