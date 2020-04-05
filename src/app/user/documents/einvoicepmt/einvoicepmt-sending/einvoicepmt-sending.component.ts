import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EinvoicepmtSignedDraftComponent } from "@app/user/documents/einvoicepmt/einvoicepmt-signed-draft/einvoicepmt-signed-draft.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-sending",
	templateUrl: "./einvoicepmt-sending.component.html",
	styleUrls: ["./einvoicepmt-sending.component.scss"]
})
export class EinvoicepmtSendingComponent extends EinvoicepmtSignedDraftComponent {

}
