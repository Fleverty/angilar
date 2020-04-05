import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormGroup } from "@angular/forms";
import { TotalSums } from "@app/user/documents/shipment-notification/total-sums";

export interface TotalSumsFormValue extends TotalSums {
	isAutoSum: boolean;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notifications-edit-sums",
	templateUrl: "./shipment-notification-edit-total-sums.component.html",
	styleUrls: ["./shipment-notification-edit-total-sums.component.scss"]
})
export class ShipmentNotificationEditTotalSumsComponent extends DefaultPopupComponent {
	@Input() public form?: FormGroup;
	public get isAutoSum(): boolean {
		const isAutoSumControl = this.form && this.form.get("isAutoSum");
		return !!(isAutoSumControl && isAutoSumControl.value);
	}

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		this.close();
	}
}
