import { Subscription, Observable, Subject } from "rxjs";
import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from "@angular/core";
import { OverlayService } from "@core/overlay.service";

import { EwaybillCreatePopupComponent } from "../ewaybill-create-popup/ewaybill-create-popup.component";
import { ActivatedRoute, Router, Event, NavigationEnd } from "@angular/router";
import { OnDestroy } from "@angular/core";
import { TemplateUtil } from "@helper/template-util";
import { Store, createSelector } from "@ngrx/store";
import { DocumentsState } from "../documents.reducer";
import { takeUntil, filter, take } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { Document, DocumentState } from "@helper/abstraction/documents";
import { exportXLSXDocuments, exportXMLDocuments } from "@app/user/user.actions";
import { EwaybillMassSendPopupComponent } from "@app/user/documents/ewaybill/ewaybill-mass-send/ewaybill-mass-send-popup/ewaybill-mass-send-popup.component";
import * as DocumentActions from "@app/user/documents/documents.actions";
import { ImportPopupComponent } from "../import-popup/import-popup.component";
import { OverlayComponent } from "@shared/overlay/overlay.component";

@Component({
	selector: "app-ewaybill-action",
	templateUrl: "./ewaybill-action.component.html",
	styleUrls: ["./ewaybill-action.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EwaybillActionComponent implements OnInit, OnDestroy {
	public isShowList = false;
	public messages: Map<string, string> = new Map<string, string>();
	@ViewChild("texts", { static: true }) public texts?: ElementRef<HTMLTemplateElement>;
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public isShowMassEventsList = false;

	@ViewChild("massEvents", { static: true })
	public set massEventsTabsMap(elementRef: ElementRef<HTMLElement>) {
		this.massEventTabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}

	public tabs: [string, string][] = [];
	public massEventTabs: [string, string][] = [];
	public readonly documentState$: Observable<DocumentState | undefined>;
	public readonly selectedItems$: Observable<Document[]>;
	public unsubscribe$$ = new Subject<void>();
	public selectIds: number[] = [];
	public activeDocumentState?: string;
	private subscription?: Subscription;
	@ViewChild("created", { static: false }) private overlayComponent?: OverlayComponent;

	constructor(
		private overlayService: OverlayService,
		private route: ActivatedRoute,
		private router: Router,
		private readonly store: Store<DocumentsState>,
		private changeDetectorRef: ChangeDetectorRef,
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
		const component = this.overlayService.show(EwaybillCreatePopupComponent, {
			inputs: { route: this.route },
			centerPosition: true
		});
		this.subscription = component.instance.close$.subscribe(() => this.overlayService.clear());
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

	public ngAfterViewInit(): void {
		if (!this.texts)
			throw Error("No template!");
		this.messages = TemplateUtil.getMap(this.texts.nativeElement);
	}

	public showImportPopup(): void {
		if (!this.overlayComponent)
			throw Error("No overlay component");

		const component = this.overlayComponent.show(ImportPopupComponent, { centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => {
			if (this.overlayComponent) {
				this.overlayComponent.destroy();
				this.overlayComponent.changeDetectorRef.detectChanges();
			}
			this.changeDetectorRef.detectChanges();
		});
	}

	public export(type: string): void {
		if (type === "xml")
			this.store.dispatch(exportXMLDocuments({
				documentType: "BLRWBL",
				documentIds: this.selectIds
			}));

		if (type === "xlsx")
			this.store.dispatch(exportXLSXDocuments({
				documentType: "EWAYBILL",
				documentIds: this.selectIds
			}));
	}

	public massEventsHandler(event: string): void {
		switch (event) {
			case "send": {
				const maxItems = 1000;
				this.selectedItems$.pipe(take(1)).subscribe((items: Document[] | undefined) => {
					const massSendPopup = this.overlayService.show(EwaybillMassSendPopupComponent, {
						inputs: {
							selectedItems: (items || []).length,
							maxSelected: maxItems
						},
						centerPosition: true
					});
					massSendPopup.instance.close$.pipe(take(1)).subscribe(() => massSendPopup.destroy());
					massSendPopup.instance.send.pipe(take(1)).subscribe(() => {
						if (items) {
							this.store.dispatch(DocumentActions.sendMassDocument(items.slice(0, maxItems).map(e => e.id)));
							massSendPopup.destroy();
						}
					});
				});
				break;
			}
			default: {
				break;
			}
		}
	}

	public showList(): void {
		if (this.selectIds.length > 0)
			this.isShowList = !this.isShowList;
	}

	public ngOnDestroy(): void {
		if (this.subscription)
			this.subscription.unsubscribe();

		this.overlayService.clear();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
