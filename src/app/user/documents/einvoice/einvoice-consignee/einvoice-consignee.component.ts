import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { ConsigneesParams, ConsigneesDto, Consignee } from "@helper/abstraction/consignee";

@Component({
	selector: "app-einvoice-consignee",
	templateUrl: "./einvoice-consignee.component.html",
	styleUrls: ["./einvoice-consignee.component.scss", "../einvoice-section.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceConsigneeComponent implements OnInit {
	@Input() public form?: FormGroup;
	public consigneesSelectBoxOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<ConsigneesDto> => {
			const params: ConsigneesParams = { ...selectBoxState, searchText: selectBoxState.search, documentTypeId: "EINVOICE" };
			return this.userBackendService.organization.consignees.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.name]),
	};
	public showContent = true;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(public readonly userBackendService: UserBackendService) { }


	public ngOnInit(): void {
		this.form && this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: Consignee) => {
			this.form && this.form.patchValue({
				id: value && value.id,
				name: value && value.name,
				address: value && value.addressFull,
				unp: value && value.unp,
				gln: value && value.gln
			});
		});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
