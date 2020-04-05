import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DocumentsState } from "../../documents.reducer";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { EwaybillSignDraftComponent } from "../ewaybill-sign-draft/ewaybill-sign-draft.component";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	selector: "app-ewaybill-sending",
	templateUrl: "./ewaybill-sending.component.html",
	styleUrls: ["./ewaybill-sending.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillSendingComponent extends EwaybillSignDraftComponent {
	constructor(
		router: Router,
		activatedRoute: ActivatedRoute,
		store: Store<DocumentsState>,
		ewaybillSelectorService: EwaybillSelectorService,
		userRoutingService: UserRoutingService,
		overlayService: OverlayService
	) {
		super(router, activatedRoute, store, ewaybillSelectorService, userRoutingService, overlayService);
	}
}
