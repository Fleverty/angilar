import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { StatisticFilterFormBuilderService } from "../statistic-filter-form-builder.service";
import { Shipper, StatisticRequestFilterParams, DeliveryPlaceFilter, DeliveryPointStatistic, StatisticOrdersFormValue } from "@helper/abstraction/statistic";
import { StatisticSelectorService } from "../statistic-selector.service";
import { StatisticFilterService } from "../statistic-filter.service";
import * as StatisticActions from "../statistic.actions";
import { MultiSelectFormValue } from "@shared/multiselect/multiselect.component";
import { takeUntil } from "rxjs/operators";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-statistics-orders-filter",
	templateUrl: "./statistics-orders-filter.component.html",
	styleUrls: ["./statistics-orders-filter.component.scss"]
})

export class StatisticsOrdersFilterComponent implements OnDestroy {
	public filterForm: FormGroup;
	public parties$: Observable<[Shipper, string][]>;
	public deliveryPoints$: Observable<[DeliveryPointStatistic, string][]>;
	public partiesFilter: StatisticRequestFilterParams = {
		fieldName: "SHIPPER_ID",
		page: 0,
		size: 10
	};
	public deliveryPointsFilter: DeliveryPlaceFilter = {
		relatedPartyId: [],
		page: 1,
		size: 40
	};
	public deliveryPlaceFilterValue: MultiSelectFormValue = {
		organizations: [],
		gln: "",
		address: ""
	};
	@Output() public appFormValue = new EventEmitter<StatisticOrdersFormValue>();
	@Output() public appResetForm = new EventEmitter<StatisticOrdersFormValue>();
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		private readonly statisticFilterFormBuilderService: StatisticFilterFormBuilderService,
		private readonly statisticSelectorService: StatisticSelectorService,
		private readonly statisticFilterService: StatisticFilterService
	) {
		this.filterForm = this.statisticFilterFormBuilderService.getOrdersFilterForm();

		const partiesControl = this.filterForm.get("parties");
		if (partiesControl) {
			partiesControl.valueChanges.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe(value => {
				this.deliveryPlaceFilterValue.organizations = [...value];
			});
		}

		this.parties$ = this.statisticSelectorService.selectDictionariesFromStore$<Shipper>(
			party => party.name,
			state => state.party,
		);

		this.deliveryPoints$ = this.statisticSelectorService.selectDictionariesFromStore$<DeliveryPointStatistic>(
			point => `${point.gln} ${point.addressFull} ${point.relatedPartyName || ""} `,
			state => state.deliveryPoints,
		);

		this.updatePartiesFilter({ search: "" });
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public updatePartiesFilter(partyName?: { search?: string }): void {
		this.statisticFilterService.updateFilter(this.partiesFilter, StatisticActions.resetParties, StatisticActions.getParties, partyName && partyName.search);
	}

	public updateDeliveryPlaceFilter(multiSelectFormValue: MultiSelectFormValue): void {
		this.deliveryPlaceFilterValue = { ...multiSelectFormValue };
		this.filterForm.patchValue({
			parties: this.deliveryPlaceFilterValue.organizations
		});
		this.statisticFilterService.updatePlaceFilter(this.deliveryPointsFilter, StatisticActions.resetDeliveryPoints, StatisticActions.getDeliveryPoints, multiSelectFormValue);
	}

	public closeDeliveryPointsPopup(): void {
		this.statisticFilterService.resetPlaces(StatisticActions.resetDeliveryPoints);
	}

	public onScrollDeliveryPlaces(): void {
		this.statisticFilterService.nextPlacePage(this.deliveryPointsFilter, StatisticActions.getDeliveryPoints);
	}

	public resetFilter(): void {
		this.deliveryPlaceFilterValue = {
			organizations: [],
			gln: "",
			address: ""
		};

		this.filterForm = this.statisticFilterFormBuilderService.getOrdersFilterForm();
		this.appResetForm.emit(this.filterForm.getRawValue());
	}

	public transformFn(value: Shipper): string {
		return value.name;
	}

	public pointTransformFn(value: DeliveryPointStatistic): string {
		return `${value.gln} ${value.addressFull} ${value.relatedPartyName || ""} `;
	}
}
