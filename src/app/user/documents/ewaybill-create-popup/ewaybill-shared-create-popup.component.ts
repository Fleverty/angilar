import { Component, ChangeDetectionStrategy, OnInit, Input } from "@angular/core";
import { EwaybillCreatePopupComponent } from "@app/user/documents/ewaybill-create-popup/ewaybill-create-popup.component";
import { CreateDocumentParams } from "@helper/abstraction/documents";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-shared-create-popup",
	styleUrls: ["./ewaybill-create-popup.component.scss"],
	templateUrl: "./ewaybill-create-popup.component.html",
})
export class EwaybillSharedCreatePopupComponent extends EwaybillCreatePopupComponent implements OnInit {
	@Input() public onCreateFn?: (formValue: CreateDocumentParams | undefined) => void;

	public onCreate(): void {
		if (typeof this.onCreateFn === "function") {
			this.onCreateFn(this.form && this.form.getRawValue());
		} else {
			super.onCreate();
		}
	}
}
