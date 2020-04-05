import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-logo",
	templateUrl: "./logoBBV.component.html",
	styleUrls: ["./logo.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent { }
