import { Component, Input } from "@angular/core";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";
import { Organization } from "@helper/abstraction/organization";
import { Ewaybill } from "@helper/abstraction/ewaybill";

@Component({
	selector: "app-current-organization-equal-receiver-equal-shipper",
	templateUrl: "./current-organization-equal-receiver-equal-shipper.component.html",
	styleUrls: ["./current-organization-equal-receiver-equal-shipper.component.scss"]
})
export class CurrentOrganizationEqualReceiverEqualShipperComponent {
	@Input() public providerConfirmation?: OperationsConfirmByProvider;
	@Input() public organizationInfo?: Organization;
	@Input() public ewaybill?: Ewaybill;
}
