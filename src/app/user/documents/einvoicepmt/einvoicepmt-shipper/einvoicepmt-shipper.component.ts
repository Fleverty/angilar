import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { Observable } from "rxjs";
import { ConsigneesDto, ConsigneesParams } from "@helper/abstraction/consignee";
import { UserBackendService } from "@app/user/user-core/user-backend.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-shipper",
	templateUrl: "./einvoicepmt-shipper.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-shipper.component.scss"]
})
export class EinvoicepmtShipperComponent {
	@Input() public form?: FormGroup;
	@Output() public fillWithSupplier: EventEmitter<void> = new EventEmitter<void>();
	public shipperSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ConsigneesDto> => {
			const params: ConsigneesParams = { ...selectBoxState, searchText: selectBoxState.search, documentTypeId: "EINVOICEPMT" };
			return this.userBackendService.organization.consignees.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.name]),
	};

	constructor(private readonly userBackendService: UserBackendService) { }
}
