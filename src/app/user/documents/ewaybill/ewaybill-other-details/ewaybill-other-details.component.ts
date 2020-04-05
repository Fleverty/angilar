import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DraftType } from "@helper/abstraction/draft";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-other-details",
	styleUrls: ["./ewaybill-other-details.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-other-details.component.html"
})

export class EwaybillOtherDetailsComponent {
	public showContent: boolean[] = [true, true];
	@Input() public form?: FormGroup;
	@Input() public draftType: DraftType = "BLRDLN";

	public view: { [key: string]: boolean } = {
		trailerNumber: false,
		transportOwnerName: false,
		quantityTrip: false,
		shipperSealNumber: false,
		proxyDate: false,
		proxyNumber: false,
		partyIssuingProxyName: false,
		contractName: false,
		leave: false,
	};

	public delete(field: string): void {
		this.view[field] = false;
		this.form && this.form.patchValue({ [field]: null });
	}
}
