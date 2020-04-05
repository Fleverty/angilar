import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-identity",
	styleUrls: ["./identity.component.scss"],
	templateUrl: "./identity.component.html"
})
export class IdentityComponent { }
