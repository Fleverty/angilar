import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { ActivatedRoute } from "@angular/router";
import { OrderCreatePopupComponent } from "../order-create-popup/order-create-popup.component";
import { createSelector, Store } from "@ngrx/store";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { Document, DocumentState } from "@helper/abstraction/documents";
import { notNull } from "@helper/operators";
import { takeUntil } from "rxjs/operators";
import { exportXMLDocuments } from "@app/user/user.actions";

@Component({
	selector: "app-order-action",
	templateUrl: "./order-action.component.html",
	styleUrls: ["./order-action.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderActionComponent implements OnInit, OnDestroy {
	public readonly documentState$: Observable<DocumentState | undefined>;
	public selectIds: number[] = [];

	private readonly selectedItems$: Observable<Document[]>;
	private readonly unsubscribe$$ = new Subject<void>();
	constructor(
		private overlayService: OverlayService,
		private activatedRoute: ActivatedRoute,
		private store: Store<DocumentsState>,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		const selectDocumentsState = (appState: any): DocumentsState => appState.documents;
		const selectDocumentState = createSelector(selectDocumentsState, (state: DocumentsState): DocumentState | undefined => state.filter && state.filter.documentState);
		const selectSelectedItems = createSelector(selectDocumentsState, (state: DocumentsState): Document[] => state.selectedItems || []);
		this.documentState$ = this.store.select(selectDocumentState);
		this.selectedItems$ = this.store.select(selectSelectedItems);
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

	public create(): void {
		const component = this.overlayService.show(OrderCreatePopupComponent, { inputs: { activatedRoute: this.activatedRoute }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public export(): void {
		this.store.dispatch(exportXMLDocuments({
			documentType: "ORDERS",
			documentIds: this.selectIds
		}));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.overlayService.clear();
	}
}
