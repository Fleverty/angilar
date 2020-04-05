import { Observable, Subject, of } from "rxjs";

import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { createSelector, select, Store } from "@ngrx/store";

import { DocumentsState } from "../documents.reducer";
import { take, takeUntil, shareReplay, switchMap } from "rxjs/operators";
import { DocumentsFilter } from "../document-filter/document-filter";
import { updateDocumentsFilter, resetDocuments, resetSelectedItems } from "../documents.actions";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { DocumentsParams, DocumentState } from "@helper/abstraction/documents";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-document-action",
	templateUrl: "./document-action.component.html",
	styleUrls: ["./document-action.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentActionComponent implements OnDestroy {
	public currentDocumentTypeId$: Observable<string | undefined>;
	public filter$: Observable<DocumentsParams | undefined>;
	public documentStatePath = documentState;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly router: Router,
		private readonly store: Store<DocumentsState>,
		private readonly userPermissionService: UserPermissionService,
		public readonly activatedRoute: ActivatedRoute
	) {
		const selectDocuments = (appState: any): DocumentsState => appState.documents;
		const selectCurrentDocumentType = createSelector(selectDocuments, (state: DocumentsState): string | undefined => state.currentDocumentTypeId);
		const selectDocumentsParams = createSelector(selectDocuments, (state: DocumentsState): DocumentsParams | undefined => state.filter);

		this.filter$ = this.store.pipe(
			select(selectDocumentsParams)
		);

		this.currentDocumentTypeId$ = this.store.pipe(
			select(selectCurrentDocumentType)
		);

		this.filter$.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(filter => {
			if (filter) {
				this.router.navigate([filter.documentState.toLocaleLowerCase()], {
					relativeTo: this.activatedRoute
				});
			}
		});
	}

	public isActive(route: string): boolean {
		const routes = this.router.url.split("?")[0].split("/");
		return route === routes[routes.length - 1];
	}

	public checkPermission$(inOrOut: "_IN" | "_OUT"): Observable<boolean> {
		return this.currentDocumentTypeId$.pipe(
			shareReplay(1),
			switchMap(docTypeId => docTypeId ? this.userPermissionService.checkPermission$(
				...this.userPermissionService.getDraftTypes(docTypeId).map(docType => docType + inOrOut)
			) : of(false)
			)
		);
	}

	public async switchDocumentState(state: DocumentState): Promise<void> {
		const filter = await this.filter$.pipe(
			take(1),
			takeUntil(this.unsubscribe$$)
		).toPromise();
		if (filter) {
			const newFilter = new DocumentsFilter({
				documentStage: "ALL", // this second priority filter, default value "ALL"
				documentState: state,
				documentTypeId: filter.documentTypeId
			});
			this.store.dispatch(resetDocuments());
			this.store.dispatch(resetSelectedItems());
			this.store.dispatch(updateDocumentsFilter(newFilter));
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
