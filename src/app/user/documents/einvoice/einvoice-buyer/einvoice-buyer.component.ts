import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Partner, PartnersDto, PartnersParams } from "@helper/abstraction/partners";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-buyer",
	templateUrl: "./einvoice-buyer.component.html",
	styleUrls: ["./einvoice-buyer.component.scss", "../einvoice-section.scss"]
})
export class EinvoiceBuyerComponent implements OnInit {
	@Input() public readonly form?: FormGroup;
	public buyerSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<PartnersDto> => {
			const params: PartnersParams = { ...selectBoxState, searchText: selectBoxState.search, documentTypeId: "EINVOICE" };
			return this.userBackendService.organization.buyers.list.get$(params);
		},
		mapData: (data: Partner[]): [Partner, string][] => data.map(e => [e, e.name]),
	};
	public showContent = true;
	private unsubscribe$$ = new Subject<void>();

	constructor(public readonly userBackendService: UserBackendService) { }

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.buyerName.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((partner: Partner) => {
				if (!partner)
					this.form && this.form.reset({}, { emitEvent: false });
				else
					this.form && this.form.patchValue({
						buyerId: partner && partner.id || null,
						buyerGln: partner && partner.gln || null,
						buyerUnp: partner && partner.unp || null,
						buyerAddress: partner && partner.addressFull || null,
					}, { emitEvent: false });
			});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
