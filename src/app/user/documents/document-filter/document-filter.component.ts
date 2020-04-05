import { Observable, Subject, OperatorFunction, asyncScheduler } from "rxjs";
import { map, take, takeUntil, pairwise, filter, throttleTime } from "rxjs/operators";

import {
	ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy,
	Output, ViewChild, ChangeDetectorRef
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DocumentStage, DocumentsParams, DocumentType } from "@helper/abstraction/documents";
import { Partner } from "@helper/abstraction/partners";
import { Storage } from "@helper/abstraction/storages";
import { TemplateUtil } from "@helper/template-util";
import { createSelector, select, Store } from "@ngrx/store";

import {
	resetPartners, resetStatuses, resetStorages, updatePartnersFilter, updateStatusesFilter,
	updateStoragesFilter
} from "../documents.actions";
import { DocumentsState } from "../documents.reducer";
import { scanData, notNull } from "@helper/operators";
import { TodayService } from "@core/today.service";
import { Status } from "@helper/abstraction/status";

export interface FormValue {
	range: [Date, Date];
	searchIn: string;
	processingStatusId?: string;
	documentNumber?: string;
	partnerId?: string;
	storageId?: string;
	documentStage: DocumentStage;
}

interface PartnerFilter {
	page: number;
	size: number;
	search?: string;
}

interface StagesFilter {
	page: number;
	size: number;
	search?: string;
}

interface StatusesFilter {
	documentTypeId: DocumentType;
}

@Component({
	selector: "app-document-filter",
	templateUrl: "./document-filter.component.html",
	styleUrls: ["./document-filter.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentFilterComponent implements OnDestroy, OnChanges {
	@Input() public documentTypeId?: DocumentType;
	@Output() public appFormValue = new EventEmitter<FormValue>();
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement)).map((e): [string, string] => e.reverse() as [string, string]);
	}
	public form: FormGroup;
	public tabs: [string, string][] = [];
	public partners$: Observable<[string, string][]>;
	public storages$: Observable<[string, string][]>;
	public statuses$: Observable<[string, string][]>;
	public filter$: Observable<DocumentsParams>;

	private form$$ = new Subject<FormValue>();

	private partnerFilter: PartnerFilter = { page: 1, search: "", size: 20 };
	private stagesFilter: StagesFilter = { page: 1, search: "", size: 20 };
	private statusesFilter?: StatusesFilter;

	private partnersLoaded = false;
	private stagesLoaded = false;
	private unsubscribe$$ = new Subject<void>();
	private todayRange: [Date, Date];

	constructor(
		private readonly store: Store<DocumentsState>,
		private readonly formBuilder: FormBuilder,
		private readonly todayService: TodayService,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		this.todayRange = this.todayService.todayRange;
		this.form = this.getForm();

		const selectDocuments = (appState: any): DocumentsState => appState.documents;
		const selectPartners = createSelector(selectDocuments, (state: DocumentsState): Partner[] | undefined => state.partners);
		const selectStorages = createSelector(selectDocuments, (state: DocumentsState): Storage[] | undefined => state.storages);
		const selectStatuses = createSelector(selectDocuments, (state: DocumentsState): Status[] | undefined => state.statuses);
		const selectDocumentsFilter = createSelector(selectDocuments, (state: DocumentsState): DocumentsParams | undefined => state.filter);

		this.partners$ = this.store.pipe(
			select(selectPartners),
			notNull(),
			scanData<Partner>(() => this.partnersLoaded = true),
			map((partners): [string, string][] => partners ? partners.map((p): [string, string] => ([p.id, p.name])) : []),
			takeUntil(this.unsubscribe$$)
		);

		this.storages$ = this.store.pipe(
			select(selectStorages),
			scanData<Storage>(),
			map((storages): [string, string][] => storages ? storages.map((p): [string, string] => ([p.id.toString(), p.addressFull || p.storageName])) : []),
		);

		this.statuses$ = this.store.pipe(
			select(selectStatuses),
			scanData<Status>(),
			map((statuses): [string, string][] => statuses ? statuses.map((p): [string, string] => ([p.id, p.name])) : []),
			takeUntil(this.unsubscribe$$)
		);

		this.filter$ = this.store.pipe(
			select(selectDocumentsFilter),
			notNull(),
			takeUntil(this.unsubscribe$$)
		);

		this.filter$.pipe(
			pairwise(),
			filterPairwiseNotNull(), // Это нужно делать чтобы когда при ините этот колбек не происходил
			filter((filter) => filter[0].documentState !== filter[1].documentState),
			takeUntil(this.unsubscribe$$)
		).subscribe(([, currentFilter]) => {
			this.form = this.getForm(currentFilter);
			this.changeDetectorRef.detectChanges();
		});

		// to add audit time
		this.form$$.pipe(
			throttleTime(750, asyncScheduler, { leading: true, trailing: true }),
			takeUntil(this.unsubscribe$$)
		).subscribe((formValue) => this.appFormValue.emit(formValue));

		this.updatePartnerFilter(1);
		this.updateStageFilter(1);
	}

	public getForm(filter?: Partial<DocumentsParams>): FormGroup {
		return this.formBuilder.group({
			range: [[filter && filter.documentDateStart || new Date(+this.todayRange[0]), filter && filter.documentDateEnd || new Date(+this.todayRange[1])]],
			searchIn: [null],
			processingStatusId: this.formBuilder.control({
				value: filter && filter.processingStatusId || null,
				disabled: filter && filter.documentState === "DRAFT"
			}),
			documentNumber: [filter && filter.documentNumber || null],
			partnerId: [filter && filter.partnerId ? +filter.partnerId : null],
			storageId: [filter && filter.storageId || null],
			documentStage: [filter && filter.documentStage || null]
		});
	}

	public ngOnChanges(): void {
		if (this.documentTypeId) {
			this.updateStatusFilter(this.documentTypeId);
			this.filter$.pipe(
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(filter => {
				this.form = this.getForm(filter);
				this.emit(this.form.getRawValue());
			});
		} else
			throw Error("No parametr documentTypeId, for DocumentFilterComponent");
	}

	public emit(value: FormValue, withAuditTime = false): void {
		if (withAuditTime)
			this.form$$.next(value);
		else
			this.appFormValue.emit(value);
	}

	public onPartnerFilterChange({ search }: { search: string }): void {
		if (this.partnerFilter.search !== "")
			this.updatePartnerFilter(1, search);
	}

	public onStageFilterChange({ search }: { search: string }): void {
		this.updateStageFilter(1, search);
	}

	// public onStatusFilterChange({ search }: { search: string }): void {
	// 	this.updateStatusFilter(search);
	// }

	public nextPartnerPage(): void {
		if (!this.partnersLoaded)
			this.updatePartnerFilter(this.partnerFilter.page + 1);
	}

	public nextStagePage(): void {
		if (!this.stagesLoaded)
			this.updateStageFilter(this.stagesFilter.page + 1);
	}

	public ngOnDestroy(): void {
		this.store.dispatch(resetPartners());
		this.store.dispatch(resetStorages());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public clear(): void {
		this.form = this.form.controls["processingStatusId"].disabled // if it is draft then disable by default
			? this.getForm({ documentState: "DRAFT" })
			: this.getForm();
		this.emit(this.form.getRawValue());
	}

	private updatePartnerFilter(page: number, partnerName?: string, size?: number): void {
		const o = { ...this.partnerFilter, page };
		if (partnerName !== undefined) {
			this.store.dispatch(resetPartners());
			this.partnersLoaded = false;
			o.search = partnerName;
		}
		o.size = size || this.partnerFilter.size;

		this.partnerFilter = o;

		this.store.dispatch(updatePartnersFilter({ page, size: o.size, searchText: o.search }));
	}

	private updateStageFilter(page: number, stageName?: string, size?: number): void {
		const o = { ...this.stagesFilter, page };
		if (stageName !== undefined) {
			this.store.dispatch(resetStorages());
			this.stagesLoaded = false;
			o.search = stageName;
		}
		o.size = size || this.stagesFilter.size;

		this.stagesFilter = o;

		this.store.dispatch(updateStoragesFilter({ page, size: o.size, searchText: o.search }));
	}

	private updateStatusFilter(documentTypeId: DocumentType): void {
		const o = { documentTypeId };
		if (documentTypeId !== undefined) {
			this.store.dispatch(resetStatuses());
			o.documentTypeId = documentTypeId;
		}
		this.statusesFilter = o;

		this.store.dispatch(updateStatusesFilter(this.statusesFilter));
	}
}

function filterPairwiseNotNull<T>(): OperatorFunction<[T | undefined | null, T | undefined | null], [NonNullable<T>, NonNullable<T>]> {
	return filter((filter: [T, T]) => !!filter[0] && !!filter[1]) as any;
}
