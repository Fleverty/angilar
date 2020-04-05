import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { Observable } from "rxjs";
import { CurrenciesDto, CurrenciesParams } from "@helper/abstraction/currency";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-common",
	templateUrl: "./einvoicepmt-common.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-common.component.scss"]
})
export class EinvoicepmtCommonComponent	 {
	@Input() public form?: FormGroup;
	public currencySelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<CurrenciesDto> => {
			const params: CurrenciesParams = { ...selectBoxState, searchText: selectBoxState.search };
			return this.userBackendService.nsi.currencies.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, `${e.code} (${e.name})`]),
	};

	constructor(private readonly userBackendService: UserBackendService) { }
}
