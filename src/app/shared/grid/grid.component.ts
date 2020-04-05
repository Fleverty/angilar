import { Subject, Observable } from "rxjs";
import {
	ChangeDetectionStrategy, Component, EventEmitter, Input, Output, QueryList, SimpleChanges,
	ViewChild, ViewChildren
} from "@angular/core";
import { Document, DocumentProperty } from "@helper/abstraction/documents";
import { TemplateUtil } from "@helper/template-util";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { OverlayComponent } from "@shared/overlay/overlay.component";
import { select, Store, createSelector } from "@ngrx/store";
import { DocumentsState } from "@app/user/documents/documents.reducer";

export interface Header {
	attribute?: string;
	key: string;
	name: string;
}
@Component({
	selector: "app-grid",
	templateUrl: "./grid.component.html",
	styleUrls: ["./grid.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class GridComponent<T extends { id: number | string } = Document> {
	public clickedItem?: T;
	public checkedRecs: number[] = [];
	public templateUtil = TemplateUtil;
	public listHeaders: Header[] = [];
	public currentDocumentTypeId$: Observable<string | undefined>;
	public get clickedItemId(): number {
		const clickedItemId = this.clickedItem && this.clickedItem.id;
		return clickedItemId ? +clickedItemId : -1;
	}

	@Input() public items: T[] = [];
	@Input() public properties: DocumentProperty[] | HTMLElement = [];
	@Input() public selectedItems?: T[];
	@Input() public highlightId?: number | string;
	@Input() public withoutFooter = false;
	@Output() public itemClick: EventEmitter<T> = new EventEmitter<T>();
	@Output() public showMore: EventEmitter<void> = new EventEmitter<void>();
	@Output() public selectItems: EventEmitter<T[]> = new EventEmitter<T[]>();
	@ViewChildren("checkbox") public checkboxes!: QueryList<CheckboxComponent>;
	@ViewChild(OverlayComponent, { static: true }) private overlayComponent?: OverlayComponent;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly store: Store<DocumentsState>
	) {
		const selectDocuments = (appState: any): DocumentsState => appState.documents;
		const selectCurrentDocumentType = createSelector(selectDocuments, (state: DocumentsState): string | undefined => state.currentDocumentTypeId);
		this.currentDocumentTypeId$ = this.store.pipe(select(selectCurrentDocumentType));
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.properties && simpleChanges.properties.currentValue) {
			if (this.properties instanceof Element || this.properties instanceof HTMLDocument)
				this.listHeaders = this.templateUtil.getArrayWithAttributes(this.properties as HTMLElement).map((e): Header => ({
					attribute: e[0].attribute,
					key: e[0].value,
					name: e[1]
				}));
			else if (Array.isArray(this.properties))
				this.listHeaders = this.properties.slice(0);
			else
				throw Error("Invalid data format");
		}
	}

	public clickItem(item: T): void {
		if (this.clickedItem && item.id === this.clickedItem.id)
			this.clickedItem = undefined;
		else {
			this.clickedItem = item;
			this.itemClick.emit(this.clickedItem);
		}
	}

	public selectedItem(doc: T): void {
		if (typeof this.selectedItems === "undefined") {
			this.selectedItems = [];
		}

		if (!this.selectedItems.find(selectedItems => selectedItems.id === doc.id)) {
			this.selectedItems = Object.assign([], this.selectedItems);
			this.selectedItems.push(doc);
			this.selectItems.emit(this.selectedItems);
		} else {
			if (this.selectedItems.length > 0) {
				const newSelectedDocuments = this.selectedItems.filter((selectedDocument): boolean => selectedDocument.id !== doc.id);
				this.selectedItems = newSelectedDocuments;
				this.selectItems.emit(newSelectedDocuments);
			} else {
				this.selectedItems = [];
				this.selectItems.emit([]);
			}
		}
	}

	public checkedItem(document: T): boolean {
		if (this.selectedItems)
			return this.selectedItems.some((selectItem: T): boolean => selectItem.id === document.id);
		else
			return false;
	}

	public clearSelectedItems(): void {
		this.selectedItems = [];
		this.selectItems.emit([]);
	}

	public selectAllItems(documents: T[]): void {
		if (!documents.length) return;
		this.selectedItems = documents;
		this.selectItems.emit(documents);
	}

	public stopPropagation(event: MouseEvent): void {
		event.stopPropagation();
	}

	public onScroll(scrollHeight: number, scrollTop: number, height: number): void {
		if (scrollTop && scrollTop + height >= scrollHeight)
			this.showMore.emit();
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
