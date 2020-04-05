import {
	Component,
	ChangeDetectionStrategy,
	Input,
	ElementRef,
	ViewChild
} from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";
import { Ewaybill, EwaybillResponse } from "@helper/abstraction/ewaybill";
import { TemplateUtil } from "@helper/template-util";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-view-main-info",
	styleUrls: ["./ewaybill-view-main-info.component.scss"],
	templateUrl: "./ewaybill-view-main-info.component.html"
})

export class EwaybillViewMainInfoComponent {
	@Input() public response?: EwaybillResponse;
	@Input() public draft?: Ewaybill;
	@Input() public messageType?: DraftType;
	@Input() public hideAdditionalView = false;
	public texts?: Map<string, string>;
	@ViewChild("statuses", { static: true, read: ElementRef }) private set textsTemplate(value: ElementRef) {
		this.texts = TemplateUtil.getMap(value.nativeElement);
	}

	public notEmpty(value: any): boolean {
		return value !== undefined && value !== null;
	}
}
