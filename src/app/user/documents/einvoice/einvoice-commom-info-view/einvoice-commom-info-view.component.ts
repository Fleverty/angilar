import { Component, ChangeDetectionStrategy, Input, ElementRef, ViewChild } from "@angular/core";
import { Einvoice } from "@helper/abstraction/einvoice";
import { TemplateUtil } from "@helper/template-util";

@Component({
	selector: "app-einvoice-commom-info-view",
	templateUrl: "./einvoice-commom-info-view.component.html",
	styleUrls: ["./einvoice-commom-info-view.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceCommomInfoViewComponent {
	@Input() public draft?: Einvoice;
	public texts?: Map<string, string>;
	@ViewChild("statuses", { static: true, read: ElementRef }) private set textsTemplate(value: ElementRef) {
		this.texts = TemplateUtil.getMap(value.nativeElement);
	}
}
