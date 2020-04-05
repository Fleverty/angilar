import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormGroup } from "@angular/forms";
import { TotalSums } from "../ewaybill";

export interface TotalSumsFormValue extends TotalSums {
	isAutoSum: boolean;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-edit-total-sums",
	styleUrls: ["ewaybill-edit-total-sums.component.scss"],
	templateUrl: "./ewaybill-edit-total-sums.component.html"
})

export class EwaybillEditTotalSumsComponent extends DefaultPopupComponent {
	@Input() public form?: FormGroup;
	public get isAutoSum(): boolean {
		const isAutoSumControl = this.form && this.form.get("isAutoSum");
		return !!(isAutoSumControl && isAutoSumControl.value);
	}

	// private unsubscribe$$: Subject<void> = new Subject<void>();

	// constructor(
	// 	private readonly store$: Store<EwaybillState>,
	// 	private formBuilder: FormBuilder,
	// ) {
	// 	super();
	// 	// const selectTotalSums = (appState: any): EwaybillState => appState.ewaybill;
	// 	// const selectSums = createSelector(selectTotalSums, (state: EwaybillState): TotalSums => state.totalSums);
	// 	// const selectFlag = (appState: any): EwaybillState => appState.ewaybill;
	// 	// const selectIsAuto = createSelector(selectFlag, (state: EwaybillState): boolean => state.isAutoSum);
	// 	// this.totalSums$ = this.store$.pipe(
	// 	// 	select(selectSums),
	// 	// 	takeUntil(this.unsubscribe$$)
	// 	// );
	// 	// this.isAutoTotal$ = this.store$.pipe(
	// 	// 	select(selectIsAuto),
	// 	// 	takeUntil(this.unsubscribe$$)
	// 	// );

	// 	// merge(this.isAutoTotal$, this.totalSums$).pipe(takeUntil(this.unsubscribe$$)).subscribe((value: boolean | TotalSums): void => {
	// 	// 	if (typeof value === "boolean") {
	// 	// 		this.isAutoSum = value;
	// 	// 	} else {
	// 	// 		this.initForm(value);
	// 	// 	}
	// 	// });
	// }

	// public ngOnDestroy(): void {
	// 	this.unsubscribe$$.next();
	// 	this.unsubscribe$$.complete();
	// }

	// public changeFlag(flag: boolean, form?: FormGroup): void {
	// 	if (!form)
	// 		throw Error("No form");
	// 	const value = form.getRawValue();
	// 	delete (value as TotalSumsFormValue).isAutoSum;
	// 	this.store$.dispatch(setTotalIsAuto(this.isAutoSum, value));
	// }

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		const value: TotalSums = form.getRawValue();
		delete (value as TotalSumsFormValue).isAutoSum;
		// this.store$.dispatch(setTotalIsAuto(this.isAutoSum, value));
		this.close();
	}

	// private initForm(initValue: TotalSums): void {
	// 	this.form = this.formBuilder.group({
	// 		amountVat: [initValue.amountVat],
	// 		amountWithVat: [initValue.amountWithVat],
	// 		amountWithoutVat: [initValue.amountWithoutVat],
	// 		isAutoSum: [this.isAutoSum],
	// 	});
	// }
}
