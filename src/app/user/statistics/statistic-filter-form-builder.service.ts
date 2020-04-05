import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { StatisticEwaybillParams, StatisticOrderParams, StatisticFilterParams, StatisticEwaybillFormValue } from "@helper/abstraction/statistic";
import { TodayService } from "@core/today.service";
import { DocumentType } from "@helper/abstraction/documents";
import { StatisticState } from "./statistic.reducer";
import { Store } from "@ngrx/store";
import { updateStatisticFilter } from "./statistic.actions";
import { Status } from "@helper/abstraction/status";

@Injectable()
export class StatisticFilterFormBuilderService {
	private todayRange: [Date, Date];
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly todayService: TodayService,
		private readonly store: Store<StatisticState>,
	) {
		this.todayRange = this.todayService.todayRange;
	}

	public getEwaybillFilterForm(initValue?: StatisticEwaybillFormValue): FormGroup {
		const value: StatisticEwaybillParams = this.getEwaybillFilterValue(initValue);
		this.store.dispatch(updateStatisticFilter({ ...value }));
		return this.formBuilder.group({
			shipper: [],
			consignee: [],
			loadingPoints: [],
			unloadingPoints: [],
			seriesAndNumber: [],
			deliveryPeriod: [[value.startDate, value.endDate]],
			processingStatus: [],
			contractNumber: [],
			testIndicator: ["all"],
		});
	}

	public getOrdersFilterForm(): FormGroup {
		const value: StatisticOrderParams = this.getInitValue("ORDERS");
		this.store.dispatch(updateStatisticFilter({ ...value }));
		return this.formBuilder.group({
			parties: [],
			deliveryPoints: [],
			documentNumber: [],
			deliveryPeriod: [[value.startDate, value.endDate]],
			orderDirection: ["all"],
		});
	}

	public getEwaybillFilterValue(initValue?: StatisticEwaybillFormValue): StatisticEwaybillParams {
		const value = this.getInitValue("EWAYBILL");
		if (!initValue) {
			return value;
		}
		const testIndicator: boolean | undefined = initValue.testIndicator === "all" ? undefined : initValue.testIndicator === "test" ? true : false;
		const shippers = initValue.shipper || [];
		const receivers = initValue.consignee || [];
		const loadingPoints = initValue.loadingPoints || [];
		const unloadingPoints = initValue.unloadingPoints || [];
		const processingStatuses: Status[] = initValue.processingStatus || [];
		const deliveryPeriod: [Date, Date] = initValue.deliveryPeriod || [new Date(), new Date()];
		return {
			...value,
			processingStatuses: processingStatuses.map(el => el.id),
			startDate: deliveryPeriod[0],
			endDate: deliveryPeriod[1],
			contractNumber: initValue.contractNumber ? initValue.contractNumber : undefined,
			deliveryNoteNumber: initValue.seriesAndNumber ? initValue.seriesAndNumber : undefined,
			testIndicator,
			shipperIds: shippers.map(val => +val.id),
			receiverIds: receivers.map(val => +val.id),
			shipsFromGln: loadingPoints.map(val => val.gln),
			shipsToGln: unloadingPoints.map(val => val.gln)
		};
	}

	public getInitValue(documentType: Extract<DocumentType, "EWAYBILL" | "ORDERS">): StatisticFilterParams {
		const value: StatisticFilterParams = {
			startDate: new Date(+this.todayRange[0]),
			endDate: new Date(+this.todayRange[1]),
			page: 1,
			size: 50,
			documentType
		};
		return value;
	}
}
