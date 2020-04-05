import { FormGroup } from "@angular/forms";
import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter
} from "@angular/core";
import { Currency } from "@helper/abstraction/currency";


@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-common-information",
	styleUrls: ["./ewaybill-common-information.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-common-information.component.html"
})
export class EwaybillCommonInformationComponent {
	public showContent = true;
	@Input() public form?: FormGroup;
	@Input() public currencies: [Currency, string][] = [];
	@Output() public appCurrencyFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	public isNumberOfOrder = false;

	public deleteNumberOrder(): void {
		this.isNumberOfOrder = false;
		this.form && this.form.patchValue({
			ordersNumber: null,
		});
	}

	public nextCurrenciesPage(): void {
		this.appCurrencyFilterChanges.emit();
	}

	public onCurrenciesFilterChanges(currencyName: { search: string }): void {
		this.appCurrencyFilterChanges.emit(currencyName.search);
	}

	public transformFn(value: any): [any, string] {
		return [value, `${value.code} (${value.name})`];
	}
}
