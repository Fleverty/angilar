import { Component, Input } from "@angular/core";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";
import { Organization } from "@helper/abstraction/organization";
import { Ewaybill } from "@helper/abstraction/ewaybill";

@Component({
	selector: "app-current-organization-equal-shipper-not-equal-receiver",
	templateUrl: "./current-organization-equal-shipper-not-equal-receiver.component.html",
	styleUrls: ["./current-organization-equal-shipper-not-equal-receiver.component.scss"]
})
export class CurrentOrganizationEqualShipperNotEqualReceiverComponent {
	@Input() public providerConfirmation?: OperationsConfirmByProvider;
	@Input() public organizationInfo?: Organization;
	@Input() public ewaybill?: Ewaybill;
}
