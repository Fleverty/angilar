import { Subject, Observable, combineLatest } from "rxjs";
import { filter, takeUntil, map, take, first, switchMap } from "rxjs/operators";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TemplateUtil } from "@helper/template-util";
import { Store, createSelector, select } from "@ngrx/store";
import { UserState } from "@app/user/user.reducer";
import { UserProfile } from "@helper/abstraction/user";
import { Organization } from "@helper/abstraction/organization";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { DocumentType, NewInboxDocuments, DescriptionDocumentType } from "@helper/abstraction/documents";
import { Role } from "@helper/abstraction/roles";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { getNewInboxDocumentsCount } from "@app/user/user.actions";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent implements OnDestroy {
	public isShowList = false;
	public isShowStatisticList = false;
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public tabs: [string, string][] = [];
	@ViewChild("statisticTabsTemplate", { static: true }) public set statisticTabsMap(elementRef: ElementRef<HTMLElement>) {
		this.statisticTabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public statisticTabs: [string, string][] = [];
	public organization$: Observable<Organization | undefined>;
	public userProfile$: Observable<UserProfile | undefined>;
	public hasNewInboxDocuments$: Observable<boolean>;
	public newInboxDocuments$: Observable<NewInboxDocuments>;
	public documentTypes$: Observable<DescriptionDocumentType[]>;
	private readonly unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly store: Store<UserState>,
		public readonly router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly documentStore: Store<DocumentsState>,
		private readonly userPermissionService: UserPermissionService,
		private readonly title: Title
	) {
		const section = (appState: any): UserState => appState.user;
		const userProfile = createSelector(section, (state: UserState): UserProfile | undefined => state.userProfile);
		this.userProfile$ = this.store.pipe(select(userProfile));

		const organizationInfo = createSelector(section, (state: UserState): Organization | undefined => state.organizationInfo);
		this.organization$ = this.store.pipe(select(organizationInfo));

		let tab = "";
		this.router.events.pipe(
			filter((e): boolean => e instanceof NavigationEnd),
			takeUntil(this.unsubscribe$$)
		).subscribe((event): void => {
			const newTab: string = (event as NavigationEnd).url.split("/")[2];
			if (newTab !== tab) {
				tab = newTab;
				this.store.dispatch(getNewInboxDocumentsCount());
				this.changeDetectorRef.detectChanges();
			}
		});

		const selectRoles = createSelector(section, (state: UserState): Role[] => state.roles);

		this.documentTypes$ = this.store.pipe(
			select(selectRoles),
			first(roles => !!roles.length),
			switchMap(roles => this.userPermissionService.getDocumentTypes$(...roles)),
			takeUntil(this.unsubscribe$$)
		);

		const newInboxDocumentsCount = createSelector(section, (state: UserState): NewInboxDocuments => state.newInboxDocumentsCount);

		this.newInboxDocuments$ = this.documentStore.pipe(select(newInboxDocumentsCount));

		this.hasNewInboxDocuments$ = combineLatest(this.documentTypes$, this.newInboxDocuments$).pipe(
			map(([docTypes, value]) => {
				if (docTypes) {
					return docTypes.reduce((acc, curr) => !!value[curr.id], false);
				}
				return false;
			}),
			takeUntil(this.unsubscribe$$)
		);
	}

	public setTitle(s: string): void {
		this.title.setTitle(s);
	}

	public async openFirstUnreadDocument(): Promise<void> {
		const newInboxDocuments = await this.newInboxDocuments$.pipe(take(1), takeUntil(this.unsubscribe$$)).toPromise();
		const documentTypes = await this.documentTypes$.pipe(take(1), takeUntil(this.unsubscribe$$)).toPromise();
		let folder: DocumentType | undefined;
		documentTypes.forEach((value: DescriptionDocumentType) => {
			if (newInboxDocuments[value.id] && !folder) {
				folder = value.id;
			}
		});

		if (folder) {
			this.router.navigate(["user", "documents", folder]);
		}
	}

	public goLink(router: string): void {
		this.store.dispatch(getNewInboxDocumentsCount());
		this.router.navigateByUrl(`${router}`);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
