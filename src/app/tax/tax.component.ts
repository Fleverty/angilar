import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-tax",
	templateUrl: "./tax.component.html",
	styleUrls: ["./tax.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxComponent { }
