import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { OrdersSelectorService } from "../order-selector.service";
import { updateCurrenciesFilter, resetCurrencies } from "../order.actions";
import { Observable } from "rxjs";
import { Currency, CurrenciesParams } from "@helper/abstraction/currency";
import { OrdersState } from "../orders.reducer";
import { UserFilterService } from "@app/user/user-core/user-filter.service";

@Component({
	selector: "app-order-common",
	templateUrl: "./order-common.component.html",
	styleUrls: ["../form.scss", "./order-common.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCommonComponent {
	public currenciesFilter: CurrenciesParams = {
		page: 1,
		searchText: "",
		size: 30
	};
	@Input() public readonly form?: FormGroup;
	public currencies$: Observable<[Currency, string][]>;

	constructor(
		private readonly ordersSelectorService: OrdersSelectorService,
		private readonly userFilterService: UserFilterService<OrdersState>
	) {
		this.currencies$ = this.ordersSelectorService.selectDictionariesFromStore$<Currency>(
			currency => `${currency.name} (${currency.code})`,
			state => state.currencies
		);

		this.updateCurrenciesFilter("");
	}

	public updateCurrenciesFilter(searchText?: string): void {
		this.userFilterService.updateFilter(this.currenciesFilter, resetCurrencies, updateCurrenciesFilter, searchText);
	}

	public transformFn(value: Currency): [any, string] {
		return [value, `${value.name} (${value.code})`];
	}
}
