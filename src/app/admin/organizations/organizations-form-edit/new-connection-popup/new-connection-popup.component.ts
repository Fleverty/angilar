import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./new-connection-popup.component.html",
	styleUrls: ["./new-connection-popup.component.scss"]
})
export class NewConnectionPopupComponent extends DefaultPopupComponent {

}
