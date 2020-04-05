import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-order-edit-total-sum",
	templateUrl: "./order-edit-total-sum.component.html",
	styleUrls: ["./order-edit-total-sum.component.scss"]
})
export class OrderEditTotalSumComponent extends DefaultPopupComponent implements OnInit {
	@Input() public form?: FormGroup;
	private prevFormValue?: any;

	constructor() {
		super();
	}

	public ngOnInit(): void {
		if (this.form) {
			const { totalQuantity, totalAmountWithoutVat, totalAmountVat, totalAmountWithVat, autoSum } = this.form.getRawValue();
			this.prevFormValue = { totalQuantity, totalAmountWithoutVat, totalAmountVat, totalAmountWithVat, autoSum };
		}
	}

	public close(): void {
		if (this.form)
			this.form.patchValue(this.prevFormValue, { emitEvent: false });
		super.close();
	}

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		super.close();
	}
}
