import { Injectable } from "@angular/core";
import { DescriptionDocumentType, DocumentType, MessageType } from "@helper/abstraction/documents";
import { Role } from "@helper/abstraction/roles";
import { DocumentsState } from "../documents/documents.reducer";
import { Store, createSelector, select } from "@ngrx/store";
import { UserState } from "../user.reducer";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { takeUntil, take, map } from "rxjs/operators";
import { DraftType } from "@helper/abstraction/draft";

@Injectable()
export class UserPermissionService {
	// разрешения приходят на draft_id
	public readonly documentTypeToDraftMap: { [key in DocumentType]: DraftType[] } = {
		EWAYBILL: ["BLRWBL", "BLRDLN", "BLRDNR", "BLRWBR"],
		ORDERS: ["ORDERS", "ORDRSP"],
		DESADV: ["DESADV"],
		ORDRSP: [],
		EINVOICE: ["BLRINV"],
		EINVOICEPMT: ["BLRPMT"]
	};

	public roles$: Observable<Role[]>;
	public unsubscribe$$ = new Subject<void>();
	private draftToDocumentTypeMap$$ = new ReplaySubject<Map<DraftType, DescriptionDocumentType>>(1);
	private readonly documentTypesPriority: { [key in DocumentType]: number } = {
		"ORDERS": 1,
		"DESADV": 2,
		"EWAYBILL": 3,
		"ORDRSP": 4,
		"EINVOICE": 5,
		"EINVOICEPMT": 6
	};

	private readonly documentResponseTypeToCommonType: { [key: string]: DraftType } = {
		BLRDNR: "BLRDLN",
		BLRWBR: "BLRWBL"
	};

	constructor(private readonly userStore: Store<DocumentsState>) {
		const selectUser = (appState: any): UserState => appState.user;
		const selectRoles = createSelector(selectUser, (state: UserState): Role[] => state.roles);
		this.roles$ = this.userStore.pipe(select(selectRoles), takeUntil(this.unsubscribe$$));
	}

	public getDescriptionDocumentType$(docType: MessageType | string): Observable<DescriptionDocumentType | undefined> {
		return this.draftToDocumentTypeMap$$.pipe(take(1), takeUntil(this.unsubscribe$$), map(map => map.get(docType as MessageType)));
	}

	public initDocumentTypes(dts: DescriptionDocumentType[]): void {
		const docToDraft = this.documentTypeToDraftMap;
		this.draftToDocumentTypeMap$$.next(Object.keys(docToDraft).reduce((map, key) => {
			const docType = dts.find(e => e.id === key);
			return docType ? docToDraft[key as DocumentType].reduce((m, draftType) => {
				m.set(draftType, docType);
				return m;
			}, map) : map;
		}, new Map<DraftType, DescriptionDocumentType>()));
	}

	public getDocumentTypes$(...roles: Role[]): Observable<DescriptionDocumentType[]> {
		return this.draftToDocumentTypeMap$$.pipe(
			map(draftToDocumentType => {
				return [...roles.reduce((dts, role) => {
					const draftType = this.roleToDraftType(role);
					const docType = draftToDocumentType.get(draftType);
					if (docType)
						dts.add(docType);
					return dts;
				}, new Set<DescriptionDocumentType>())].sort(this.sortDocumentTypes.bind(this));
			})
		);
	}

	public getDraftTypes(documentTypeId: string | DocumentType): DraftType[] {
		return (this.documentTypeToDraftMap[documentTypeId as DocumentType] || []).slice(0);
	}

	public getDocumentType(draftType: string | DraftType): DocumentType | undefined {
		const map = this.documentTypeToDraftMap;
		for (const docType in map) {
			const draftTypes = map[docType as DocumentType] || [];
			if (draftTypes.some(dt => dt === draftType))
				return docType as DocumentType;
		}
	}

	public getCommonDraftType(draftType: string | DraftType): DraftType {
		return this.documentResponseTypeToCommonType[draftType as DraftType];
	}

	public checkPermission$(...roleIds: string[]): Observable<boolean> {
		return this.roles$.pipe(
			take(1),
			map(roles => roles.some(r => roleIds.some(ri => ri === r.id)))
		);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private sortDocumentTypes(first: DescriptionDocumentType, second: DescriptionDocumentType): number {
		if (this.documentTypesPriority[first.id] > this.documentTypesPriority[second.id]) {
			return 1;
		}
		return -1;
	}

	private roleToDraftType(role: Role): DraftType {
		return role.id.split("_")[0] as DraftType;
	}
}
