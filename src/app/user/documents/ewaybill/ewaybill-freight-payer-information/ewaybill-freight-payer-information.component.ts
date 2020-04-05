import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { EwaybillFormBuilderService } from "@app/user/documents/ewaybill/ewaybill/ewaybill-form-builder.service";

@Component({
	selector: "app-ewaybill-freight-payer-information",
	templateUrl: "./ewaybill-freight-payer-information.component.html",
	styleUrls: ["./ewaybill-freight-payer-information.component.scss", "../ewaybill-default-component.scss"]
})
export class EwaybillFreightPayerInformationComponent implements OnInit {
	@Input() public form?: FormGroup;
	@Output() public fillWith: EventEmitter<"CUSTOMER" | "PROVIDER"> = new EventEmitter<"CUSTOMER" | "PROVIDER">();
	public showContent = true;
	public isAddFreightPayerClicked = false;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(private readonly ewaybillFormBuilderService: EwaybillFormBuilderService) { }

	public ngOnInit(): void {
		if (this.form && (this.form.value.name || this.form.value.address || this.form.value.gln || this.form.value.unp)) {
			// this.ewaybillFormBuilderService.appendCustomerForm(this.form);
			this.isAddFreightPayerClicked = true;
		}
	}

	public deleteFreightPayer(): void {
		if (!this.form)
			throw new Error("No form provided!");
		this.isAddFreightPayerClicked = false;
		this.ewaybillFormBuilderService.removeCustomerForm(this.form);
	}

	public addFreightPayer(): void {
		if (!this.form)
			throw new Error("No form provided!");
		this.ewaybillFormBuilderService.appendCustomerForm(this.form);
		this.isAddFreightPayerClicked = true;
	}

	public equateToParticipant(fillWith: "CUSTOMER" | "PROVIDER"): void {
		if (!this.form)
			throw Error("No Form provided!");

		this.fillWith.emit(fillWith);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
