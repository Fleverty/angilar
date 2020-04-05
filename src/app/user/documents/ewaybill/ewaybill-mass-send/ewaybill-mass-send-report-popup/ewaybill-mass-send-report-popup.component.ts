import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { MassSendReport } from "@helper/abstraction/documents";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-mass-send-report-popup",
	templateUrl: "./ewaybill-mass-send-report-popup.component.html",
	styleUrls: ["./ewaybill-mass-send-report-popup.component.scss"]
})
export class EwaybillMassSendReportPopupComponent extends DefaultPopupComponent {
	@Input() public report?: MassSendReport;
	public showAdditional = false;
}
