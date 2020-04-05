import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { createSelector, select, Store } from "@ngrx/store";
import { StatisticState } from "./statistic.reducer";
import { DocumentProperty, DocumentType, DocumentState } from "@helper/abstraction/documents";
import { Observable, Subject } from "rxjs";
import { StatisticEwaybillDocument, StatisticEwaybillFormValue, StatisticEwaybillParams, StatisticOrdersDocument, StatisticOrderParams, StatisticOrdersFormValue } from "@helper/abstraction/statistic";
import * as StatisticActions from "./statistic.actions";
import { StatisticSelectorService } from "./statistic-selector.service";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { take, takeUntil } from "rxjs/operators";
import { TemplateUtil } from "@helper/template-util";
import { StatisticFilterFormBuilderService } from "./statistic-filter-form-builder.service";
import { notNull, scanData } from "@helper/operators";
import * as UserActions from "../user.actions";
import { Status } from "@helper/abstraction/status";
import { UserState } from "@app/user/user.reducer";
import { Organization } from "@helper/abstraction/organization";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { StatisticCookieService } from "./statistic-cookie.service";

@Component({
	selector: "app-statistics",
	templateUrl: "./statistics.component.html",
	styleUrls: ["./statistics.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnDestroy {
	public showExport = false;
	public documentProperties$: Observable<DocumentProperty[]>;
	public documents$: Observable<(StatisticEwaybillDocument | StatisticOrdersDocument)[]>;
	public selectedItems$: Observable<(StatisticEwaybillDocument | StatisticOrdersDocument)[]>;
	public organizationInfo?: Organization;
	public selectIds: number[] = [];
	@ViewChild("tabsTemplate", { static: true }) public set tabsMap(elementRef: ElementRef<HTMLElement>) {
		this.tabs = Array.from(TemplateUtil.getMap(elementRef.nativeElement));
	}
	public tabs: [string, string][] = [];
	public statisticType?: Extract<DocumentType, "EWAYBILL" | "ORDERS">;
	private statisticEwaybillParams: StatisticEwaybillParams;
	private statisticOrdersParams: StatisticOrderParams;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly store: Store<StatisticState>,
		private readonly documentStore: Store<DocumentState>,
		private readonly statisticSelectorService: StatisticSelectorService,
		private readonly statisticFilterFormBuilderService: StatisticFilterFormBuilderService,
		private readonly router: Router,
		private readonly userPermissionService: UserPermissionService,
		private readonly overlayService: OverlayService,
		private readonly translationService: TranslationService,
		private readonly statisticCookieService: StatisticCookieService
	) {
		this.router.events.pipe(takeUntil(this.unsubscribe$$)).subscribe(e => {
			if (e instanceof NavigationStart && !e.url.includes("user/documents/EWAYBILL/statistic/view")) {
				this.statisticCookieService.clearEwaybillFilterValue();
			}
			if (e instanceof NavigationEnd) {
				this.statisticType = e.urlAfterRedirects.split("/").reverse()[0] as Extract<DocumentType, "EWAYBILL" | "ORDERS">; // TODO BAHATKA
				this.store.dispatch(StatisticActions.switchStatisticProperties(this.statisticType));
				this.store.dispatch(StatisticActions.updateStatusesFilter(this.statisticType));
				this.store.dispatch(StatisticActions.resetDocuments());
			}
		});

		this.statisticEwaybillParams = this.statisticFilterFormBuilderService.getInitValue("EWAYBILL");
		this.statisticOrdersParams = this.statisticFilterFormBuilderService.getInitValue("ORDERS");

		this.documentProperties$ = this.statisticSelectorService.select$<DocumentProperty[]>(state => state.currentStatisticProperties);
		this.documents$ = this.statisticSelectorService.select$<StatisticEwaybillDocument[] | StatisticOrdersDocument[] | undefined>(state => state.documents).pipe(scanData<StatisticEwaybillDocument | StatisticOrdersDocument>());
		this.selectedItems$ = this.statisticSelectorService.select$<StatisticEwaybillDocument[]>(state => state.selectedItems);

		const selectUserState = (appState: any): UserState => appState.user;
		const selectOrganizationInfo = createSelector(selectUserState, (state: UserState): Organization | undefined => state.organizationInfo);
		this.store.pipe(select(selectOrganizationInfo)).pipe(notNull(), take(1)).subscribe((organizationInfo: Organization) => {
			this.organizationInfo = organizationInfo;
		});

		this.selectedItems$.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(documents => this.selectIds = documents.map((doc: StatisticEwaybillDocument | StatisticOrdersDocument) => doc.id));
	}

	public ngOnDestroy(): void {
		this.store.dispatch(StatisticActions.resetDocuments());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public actionSelectItems(selectItems: StatisticEwaybillDocument[]): void {
		if (selectItems.length > 0)
			this.store.dispatch(StatisticActions.pushSelectedItems(selectItems));
		else
			this.store.dispatch(StatisticActions.resetSelectedItems());
	}

	public export(type: "xml" | "xlsx"): void {
		if (!this.selectIds.length) {
			return;
		}
		if (type === "xml")
			this.documentStore.dispatch(UserActions.exportXMLDocuments({
				documentType: this.statisticType === "EWAYBILL" ? "BLRWBL" : "ORDERS",
				documentIds: this.selectIds
			}));

		if (type === "xlsx")
			this.documentStore.dispatch(UserActions.exportXLSXDocuments({
				documentType: this.statisticType as DocumentType,
				documentIds: this.selectIds
			}));
	}

	public updateEwaybillFilterValue(formValue?: StatisticEwaybillFormValue): void {
		if (formValue) {
			if (!this.isPeriodLessThanMonth(formValue.deliveryPeriod)) {
				this.overlayService.showNotification$(this.translationService.getTranslation("errorMonth"), "error");
				return;
			}
			this.statisticCookieService.setEwaybillFilterValue(formValue);
			this.statisticEwaybillParams = this.mapToEwaybillStatisticParams(formValue);
			this.store.dispatch(StatisticActions.resetDocuments());
		} else {
			this.statisticEwaybillParams.page++;
		}
		this.store.dispatch(StatisticActions.updateStatisticFilter({ ...this.statisticEwaybillParams }));
	}

	public resetEwaybillFilter(formValue: StatisticEwaybillFormValue): void {
		this.statisticEwaybillParams = this.mapToEwaybillStatisticParams(formValue);
		this.statisticCookieService.clearEwaybillFilterValue();
		this.store.dispatch(StatisticActions.resetDocuments());
		this.store.dispatch(StatisticActions.updateStatisticFilter({ ...this.statisticEwaybillParams }));
	}

	public updateOrdersFilterValue(formValue?: StatisticOrdersFormValue): void {
		if (formValue) {
			if (!this.isPeriodLessThanMonth(formValue.deliveryPeriod)) {
				this.overlayService.showNotification$(this.translationService.getTranslation("errorMonth"), "error");
				return;
			}
			this.statisticOrdersParams = this.mapToOrdersStatisticParams(formValue);
			this.store.dispatch(StatisticActions.resetDocuments());
		} else {
			this.statisticOrdersParams.page++;
		}
		this.store.dispatch(StatisticActions.updateStatisticFilter({ ...this.statisticOrdersParams }));
	}

	public resetOrdersFilter(formValue: StatisticOrdersFormValue): void {
		this.statisticOrdersParams = this.mapToOrdersStatisticParams(formValue);
		this.store.dispatch(StatisticActions.resetDocuments());
		this.store.dispatch(StatisticActions.updateStatisticFilter({ ...this.statisticOrdersParams }));
	}

	public getStatisticOnExcel(): void {
		this.statisticType === "EWAYBILL" ? this.store.dispatch(UserActions.getStatisticsEwaybillXLSX({ ...this.statisticEwaybillParams })) : this.store.dispatch(UserActions.getStatisticsOrdersXLSX({ ...this.statisticOrdersParams }));
	}

	public openDocument(doc: StatisticEwaybillDocument): void {
		if (!this.organizationInfo || !doc.shipper)
			return;

		const docType = this.userPermissionService.getDocumentType(doc.msgType);
		if (docType === "EWAYBILL") {
			this.router.navigate(["user", "documents", "EWAYBILL", "statistic", "view", doc.msgType, doc.id]);
		}
	}

	public mapToEwaybillStatisticParams(formValue: StatisticEwaybillFormValue): StatisticEwaybillParams {
		const testIndicator: boolean | undefined = formValue.testIndicator === "all" ? undefined : formValue.testIndicator === "test" ? true : false;
		const shippers = formValue.shipper || [];
		const receivers = formValue.consignee || [];
		const loadingPoints = formValue.loadingPoints || [];
		const unloadingPoints = formValue.unloadingPoints || [];
		const processingStatuses: Status[] = formValue.processingStatus || [];
		const deliveryPeriod: [Date, Date] = formValue.deliveryPeriod || [new Date(), new Date()];
		return {
			processingStatuses: processingStatuses.map(el => el.id),
			startDate: deliveryPeriod[0],
			endDate: deliveryPeriod[1],
			page: 1,
			size: 40,
			contractNumber: formValue.contractNumber ? formValue.contractNumber : undefined,
			deliveryNoteNumber: formValue.seriesAndNumber ? formValue.seriesAndNumber : undefined,
			testIndicator,
			shipperIds: shippers.map(val => +val.id),
			receiverIds: receivers.map(val => +val.id),
			shipsFromGln: loadingPoints.map(val => val.gln),
			shipsToGln: unloadingPoints.map(val => val.gln),
			documentType: "EWAYBILL"
		};
	}

	public mapToOrdersStatisticParams(formValue: StatisticOrdersFormValue): StatisticOrderParams {
		const orderDirection: "1" | "0" | undefined = formValue.orderDirection === "all" ? undefined : formValue.orderDirection;
		const deliveryPeriod: [Date, Date] = formValue.deliveryPeriod || [new Date(), new Date()];
		const parties = formValue.parties || [];
		const deliveryPoints = formValue.deliveryPoints || [];
		return {
			startDate: deliveryPeriod[0],
			endDate: deliveryPeriod[1],
			page: 1,
			size: 50,
			documentNumber: formValue.documentNumber ? formValue.documentNumber : undefined,
			orderDirection,
			partyIds: parties.map(val => +val.id),
			deliveryPointGln: deliveryPoints.map(val => val.gln),
			documentType: "ORDERS"
		};
	}

	public showMore(): void {
		this.statisticType === "EWAYBILL" ? this.updateEwaybillFilterValue() : this.updateOrdersFilterValue();
	}

	private isPeriodLessThanMonth(period?: [Date, Date]): boolean {
		return period ? +period[1] - +period[0] <= 2678400000 : true;
	}
}
