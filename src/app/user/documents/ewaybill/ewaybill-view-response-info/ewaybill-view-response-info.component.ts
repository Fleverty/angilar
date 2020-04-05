import { Component, ChangeDetectionStrategy } from "@angular/core";
import { DraftType } from "@helper/abstraction/draft";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-view-response-info",
	styleUrls: ["../ewaybill-view.scss"],
	templateUrl: "./ewaybill-view-response-info.component.html"
})

export class EwaybillViewResponseInfoComponent {
	public messageType?: DraftType;
} 
