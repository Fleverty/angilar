import { FormGroup } from "@angular/forms";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { CurrenciesParams, CurrenciesDto } from "@helper/abstraction/currency";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { Observable } from "rxjs";


@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-common-information",
	styleUrls: ["./einvoice-common-information.component.scss", "../einvoice-section.scss"],
	templateUrl: "./einvoice-common-information.component.html"
})
export class EinvoiceCommonInformationComponent {
	@Input() public form?: FormGroup;
	public showContent = true;
	public isNumberOfOrder = false;
	public currencySelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<CurrenciesDto> => {
			const params: CurrenciesParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.currencies.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.name]),
	};

	constructor(public readonly userBackendService: UserBackendService) { }

	public deleteNumberOrder(): void {
		this.isNumberOfOrder = false;
		this.form && this.form.patchValue({
			ordersNumber: null,
		});
	}
}
