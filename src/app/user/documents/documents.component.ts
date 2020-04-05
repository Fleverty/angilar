import { Observable, Subject, combineLatest } from "rxjs";
import { first, filter, takeUntil, switchMap, take } from "rxjs/operators";

import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy
} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { DescriptionDocumentType, NewInboxDocuments, DocumentType, DocumentsParams } from "@helper/abstraction/documents";
import { createSelector, select, Store } from "@ngrx/store";

import { switchDocumentType } from "./documents.actions";
import { DocumentsState } from "./documents.reducer";
import { UserState } from "../user.reducer";
import { Role } from "@helper/abstraction/roles";
import { UserPermissionService } from "../user-core/user-permission.service";
import { DocumentsFilter } from "./document-filter/document-filter";
import { DocumentParamsService } from "./document-params.service";
import { notNull } from "@helper/operators";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-documents",
	styleUrls: ["./documents.component.scss"],
	templateUrl: "./documents.component.html"
})
export class DocumentsComponent implements OnDestroy {
	public documentTypes$: Observable<DescriptionDocumentType[]>;
	public newInboxDocuments$: Observable<NewInboxDocuments>;
	public filter$: Observable<DocumentsParams | undefined>;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly documentStore: Store<DocumentsState>,
		private readonly userStore: Store<DocumentsState>,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly documentParamsService: DocumentParamsService,
		private readonly userPermissionService: UserPermissionService,
	) {
		const selectUser = (appState: any): UserState => appState.user;
		const selectRoles = createSelector(selectUser, (state: UserState): Role[] => state.roles);

		const selectDocuments = (appState: any): DocumentsState => appState.documents;
		const selectDocumentsFilter = createSelector(selectDocuments, (state: DocumentsState): DocumentsParams | undefined => state.filter);
		this.filter$ = this.documentStore.pipe(
			select(selectDocumentsFilter)
		);

		this.documentTypes$ = this.userStore.pipe(
			select(selectRoles),
			first(roles => !!roles.length),
			switchMap(roles => this.userPermissionService.getDocumentTypes$(...roles)),
			takeUntil(this.unsubscribe$$)
		);

		// достает состояние фильтра из урла
		combineLatest([this.router.events, this.documentTypes$, this.filter$]).pipe(
			filter(([event]) => event instanceof NavigationEnd && event.url.startsWith("/user/documents", 0)),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(([, dts, filter]) => {
			const fc = this.activatedRoute.firstChild;
			const child = fc && fc.firstChild;
			const documentTypeId = fc && fc.snapshot && fc.snapshot.paramMap.get("documentTypeId") || dts[0].id;
			if (filter && child && child.snapshot && filter.documentState !== (child.snapshot.params.actionTypeKey || "").toUpperCase()) {
				this.switchDocumentType(documentTypeId as DocumentType);
			} else {
				const params = {
					...this.activatedRoute.snapshot.queryParams,
					documentTypeId,
					documentState: child && child.snapshot && (child.snapshot.params.actionTypeKey || "").toUpperCase(),
				};
				const presetFilter = this.documentParamsService.fromParams(params);
				this.switchDocumentType(documentTypeId as DocumentType, presetFilter || undefined);
			}
		});

		combineLatest(this.router.events, this.documentTypes$).pipe(
			filter(([event]) => event instanceof NavigationEnd && event.url === "/user/documents"),
			takeUntil(this.unsubscribe$$)
		).subscribe(([, dts]) => this.switchDocumentType(dts[0].id));

		const selectNewInboxDocumentsCount = createSelector(selectUser, (state: UserState): NewInboxDocuments => state.newInboxDocumentsCount);
		this.newInboxDocuments$ = this.userStore.pipe(
			notNull(),
			select(selectNewInboxDocumentsCount)
		);
	}

	public switchDocumentType(dtId: DocumentType, filter?: DocumentsFilter): void {
		this.router.navigate([dtId], { relativeTo: this.activatedRoute });
		this.documentStore.dispatch(switchDocumentType(dtId, filter));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
