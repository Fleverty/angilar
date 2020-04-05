import { ChangeDetectionStrategy, Component, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { StatisticEwaybillFormValue, Shipper, StatisticRequestFilterParams, DeliveryPointStatistic, DeliveryPlaceFilter } from "@helper/abstraction/statistic";
import { StatisticSelectorService } from "../statistic-selector.service";
import { Observable, Subject } from "rxjs";
import * as StatisticActions from "../statistic.actions";
import { StatisticFilterFormBuilderService } from "../statistic-filter-form-builder.service";
import { MultiSelectFormValue } from "@shared/multiselect/multiselect.component";
import { StatisticFilterService } from "../statistic-filter.service";
import { Status } from "@helper/abstraction/status";
import { takeUntil } from "rxjs/operators";
import { StatisticCookieService } from "../statistic-cookie.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-statistics-ewaybill-filter",
	templateUrl: "./statistics-ewaybill-filter.component.html",
	styleUrls: ["./statistics-ewaybill-filter.component.scss"]
})
export class StatisticsEwaybillFilterComponent implements OnDestroy {
	public filterForm: FormGroup;
	public shipper$: Observable<[Shipper, string][]>;
	public receiver$: Observable<[Shipper, string][]>;
	public loadingPoints$: Observable<[DeliveryPointStatistic, string][]>;
	public unloadingPoints$: Observable<[DeliveryPointStatistic, string][]>;
	public shipperFilter: StatisticRequestFilterParams = {
		fieldName: "SHIPPER_ID",
		page: 0,
		size: 10,
	};
	public receiverFilter: StatisticRequestFilterParams = {
		fieldName: "RECEIVER_ID",
		page: 0,
		size: 10,
	};
	public loadingPlaceFilter: DeliveryPlaceFilter = {
		relatedPartyId: [],
		page: 1,
		size: 40
	};
	public unloadingPlaceFilter: DeliveryPlaceFilter = {
		relatedPartyId: [],
		page: 1,
		size: 40
	};
	public loadingPlaceFilterValue: MultiSelectFormValue = {
		organizations: [],
		gln: "",
		address: ""
	};
	public unloadingPlaceFilterValue: MultiSelectFormValue = {
		organizations: [],
		gln: "",
		address: ""
	};
	@Output() public appFormValue = new EventEmitter<StatisticEwaybillFormValue>();
	@Output() public appResetForm = new EventEmitter<StatisticEwaybillFormValue>();
	public statuses$: Observable<[Status, string][]>;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly statisticFilterFormBuilderService: StatisticFilterFormBuilderService,
		private readonly statisticSelectorService: StatisticSelectorService,
		private readonly statisticFilterService: StatisticFilterService,
		private readonly statisticCookieService: StatisticCookieService
	) {
		const initValue = this.statisticCookieService.isEwaybillFilterValueExist() ? this.statisticCookieService.getEwaybillFilterValue() : undefined;
		this.filterForm = this.statisticFilterFormBuilderService.getEwaybillFilterForm(initValue);

		if (initValue) {
			const deliveryPeriod = initValue.deliveryPeriod ? [new Date(initValue.deliveryPeriod[0]), new Date(initValue.deliveryPeriod[1])] : [new Date(), new Date()];
			this.filterForm.patchValue({
				...initValue,
				deliveryPeriod
			});
		}

		const shipperControl = this.filterForm.get("shipper");
		const consigneeControl = this.filterForm.get("consignee");

		if (shipperControl && consigneeControl) {
			shipperControl.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe(value => {
				this.loadingPlaceFilterValue.organizations = [...value];
			});

			consigneeControl.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe(value => {
				this.unloadingPlaceFilterValue.organizations = [...value];
			});
		}

		this.shipper$ = this.statisticSelectorService.selectDictionariesFromStore$<Shipper>(
			shipper => shipper.name,
			state => state.shipper,
		);

		this.receiver$ = this.statisticSelectorService.selectDictionariesFromStore$<Shipper>(
			receiver => receiver.name,
			state => state.receiver,
		);

		this.statuses$ = this.statisticSelectorService.selectDictionariesFromStore$<Status>(
			status => status.name,
			state => state.statuses
		);

		this.loadingPoints$ = this.statisticSelectorService.selectDictionariesFromStore$<DeliveryPointStatistic>(
			point => `${point.gln} ${point.addressFull} ${point.relatedPartyName || ""}`,
			state => state.loadingPoints
		);

		this.unloadingPoints$ = this.statisticSelectorService.selectDictionariesFromStore$<DeliveryPointStatistic>(
			point => `${point.gln} ${point.addressFull} ${point.relatedPartyName || ""}`,
			state => state.unloadingPoints
		);

		this.updateShipperFilter({ search: "" });
		this.updateReceiverFilter({ search: "" });
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public updateShipperFilter(shipperName?: { search?: string }): void {
		this.statisticFilterService.updateFilter(this.shipperFilter, StatisticActions.resetShipper, StatisticActions.getShipper, shipperName && shipperName.search);
	}

	public updateReceiverFilter(receiverName?: { search?: string }): void {
		this.statisticFilterService.updateFilter(this.receiverFilter, StatisticActions.resetReceiver, StatisticActions.getReceiver, receiverName && receiverName.search);
	}

	public updateShipToPlaceFilter(multiSelectFormValue: MultiSelectFormValue): void {
		this.loadingPlaceFilterValue = { ...multiSelectFormValue };
		this.filterForm.patchValue({
			shipper: this.loadingPlaceFilterValue.organizations
		});
		this.statisticFilterService.updatePlaceFilter(this.loadingPlaceFilter, StatisticActions.resetLoadingPoints, StatisticActions.getLoadingPoints, multiSelectFormValue);
	}

	public closeShipToPopup(): void {
		this.statisticFilterService.resetPlaces(StatisticActions.resetLoadingPoints);
	}

	public onScrollShipToPlaces(): void {
		this.statisticFilterService.nextPlacePage(this.loadingPlaceFilter, StatisticActions.getLoadingPoints);
	}

	public updateShipFromPlaceFilter(multiSelectFormValue: MultiSelectFormValue): void {
		this.unloadingPlaceFilterValue = { ...multiSelectFormValue };
		this.filterForm.patchValue({
			consignee: this.unloadingPlaceFilterValue.organizations
		});
		this.statisticFilterService.updatePlaceFilter(this.unloadingPlaceFilter, StatisticActions.resetUnloadingPoints, StatisticActions.getUnloadingPoints, multiSelectFormValue);
	}

	public closeShipFromPopup(): void {
		this.statisticFilterService.resetPlaces(StatisticActions.resetUnloadingPoints);
	}

	public onScrollShipFromPlaces(): void {
		this.statisticFilterService.nextPlacePage(this.unloadingPlaceFilter, StatisticActions.getUnloadingPoints);
	}

	public resetFilter(): void {
		this.loadingPlaceFilterValue = {
			organizations: [],
			gln: "",
			address: ""
		};
		this.unloadingPlaceFilterValue = {
			organizations: [],
			gln: "",
			address: ""
		};

		this.filterForm = this.statisticFilterFormBuilderService.getEwaybillFilterForm();
		this.appResetForm.emit(this.filterForm.getRawValue());
	}

	public transformFn(value: { name: string }): string {
		return value.name;
	}

	public pointTransformFn(value: DeliveryPointStatistic): string {
		return `${value.gln} ${value.addressFull} ${value.relatedPartyName || ""} `;
	}
}
