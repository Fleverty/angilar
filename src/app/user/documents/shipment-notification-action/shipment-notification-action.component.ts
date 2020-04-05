import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Document, DocumentState } from "@helper/abstraction/documents";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { createSelector, Store } from "@ngrx/store";
import { notNull } from "@helper/operators";
import { takeUntil } from "rxjs/operators";
import { exportXMLDocuments } from "@app/user/user.actions";

@Component({
	selector: "app-shipment-notifications-action",
	templateUrl: "./shipment-notification-action.component.html",
	styleUrls: ["./shipment-notification-action.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentNotificationActionComponent implements OnInit, OnDestroy {
	public readonly documentState$: Observable<DocumentState | undefined>;
	public selectIds: number[] = [];

	private readonly selectedItems$: Observable<Document[]>;
	private readonly unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
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
		this.router.navigate(["create"], { relativeTo: this.activatedRoute });
	}

	public export(): void {
		this.store.dispatch(exportXMLDocuments({
			documentType: "DESADV",
			documentIds: this.selectIds
		}));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
