import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EwaybillShipper } from "../ewaybill-view/ewaybill-shipper";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-outbox-received",
	templateUrl: "./ewaybill-outbox-received.component.html",
	styleUrls: ["./ewaybill-outbox-received.component.scss"]
})

export class EwaybillOutboxReceivedComponent extends EwaybillShipper {
	protected unsubscribe$$ = new Subject<void>();
	constructor(
		private readonly userRoutingService: UserRoutingService,
		activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		overlayService: OverlayService,
		ewaybillSelectorService: EwaybillSelectorService,
		translationService: TranslationService,
		router: Router,
		actions: Actions
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);
	}

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}
}
