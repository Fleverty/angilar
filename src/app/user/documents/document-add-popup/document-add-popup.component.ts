import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-document-add-popup",
	styleUrls: ["./document-add-popup.component.scss"],
	templateUrl: "./document-add-popup.component.html"
})

export class DocumentAddPopupComponent extends DefaultPopupComponent {

}
