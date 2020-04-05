import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { Observable, Subject } from "rxjs";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { PartnersDto, PartnersParams } from "@helper/abstraction/partners";
import { takeUntil } from "rxjs/operators";
import { EinvoicepmtPartner } from "@helper/abstraction/einvoicepmt";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-buyer",
	templateUrl: "./einvoicepmt-buyer.component.html",
	styleUrls: ["../form.scss", "./einvoicepmt-buyer.component.scss"]
})
export class EinvoicepmtBuyerComponent implements OnInit {
	@Input() public form?: FormGroup;
	public unsubscribe$$ = new Subject<void>();
	public buyerSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<PartnersDto> => {
			const params: PartnersParams = { ...selectBoxState, searchText: selectBoxState.search, documentTypeId: "EINVOICEPMT" };
			return this.userBackendService.organization.buyers.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.name]),
	};

	constructor(private readonly userBackendService: UserBackendService) { }

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((partner: EinvoicepmtPartner) => {
				if (!partner) {
					this.form && this.form.reset({}, { emitEvent: false });
				}
				else {
					this.form && this.form.patchValue({
						buyerAddress: partner && partner.addressFull,
						buyerId: partner && partner.id || null,
						buyerGln: partner && partner.gln || null,
						buyerUnp: partner && partner.unp || null,
						buyerAccountNumber: partner && partner.accountNumber || null,
						buyerBankName: partner && partner.bankName || null,
						buyerBankAddress: partner && partner.bankAddress || null,
						buyerBankCode: partner && partner.bankCode || null,
						buyerName: partner && partner.name || null
					}, { emitEvent: false });
				}
			});
	}
}
