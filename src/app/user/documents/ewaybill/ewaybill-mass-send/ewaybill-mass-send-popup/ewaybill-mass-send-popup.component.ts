import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { Subject } from "rxjs";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-mass-send-popup",
	templateUrl: "./ewaybill-mass-send-popup.component.html",
	styleUrls: ["./ewaybill-mass-send-popup.component.scss"]
})
export class EwaybillMassSendPopupComponent extends DefaultPopupComponent {
	@Input() public selectedItems = 0;
	@Input() public maxSelected = 0;

	public send: Subject<void> = new Subject<void>();
}
