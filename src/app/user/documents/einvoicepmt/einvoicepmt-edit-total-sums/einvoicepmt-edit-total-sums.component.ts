import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { EinvoicepmtFormBuilderService } from "@app/user/documents/einvoicepmt/einvoicepmt-form-builder.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-edit-total-sums",
	templateUrl: "./einvoicepmt-edit-total-sums.component.html",
	styleUrls: ["./einvoicepmt-edit-total-sums.component.scss"]
})
export class EinvoicepmtEditTotalSumsComponent extends DefaultPopupComponent implements OnInit {
	@Input() public form?: FormGroup;
	public newForm?: FormGroup;

	constructor(private readonly einvoicepmtFormBuilderService: EinvoicepmtFormBuilderService) {
		super();
	}

	public ngOnInit(): void {
		if (!this.form)
			throw new Error("Please provide form to EinvoicepmtEditTotalSumsComponent");
		this.newForm = this.einvoicepmtFormBuilderService.getEinvoicepmtTotalSumsForm();
		this.newForm.patchValue(this.form.value);
	}

	public get isAutoSum(): boolean {
		const isAutoSumControl = this.newForm && this.newForm.get("isAutoSum");
		return !!(isAutoSumControl && isAutoSumControl.value);
	}

	public save(form?: FormGroup): void {
		if (!form)
			throw Error("No form");
		this.form && this.form.patchValue(this.newForm && this.newForm.getRawValue());
		super.close();
	}
}
