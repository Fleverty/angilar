import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { TemplateUtil } from "@helper/template-util";

@Component({
	selector: "app-einvoicepmt-view-main-info",
	templateUrl: "./einvoicepmt-view-main-info.component.html",
	styleUrls: ["./einvoicepmt-view-main-info.component.scss"]
})
export class EinvoicepmtViewMainInfoComponent {
	@Input() public document?: EinvoicepmtDto;
	@ViewChild("statusesTemplate", { read: ElementRef, static: true }) private set statusesTemplate(element: ElementRef) {
		this.statuses = TemplateUtil.getMap(element.nativeElement);
	}
	public statuses: Map<string, string> = new Map<string, string>();
}
