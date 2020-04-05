import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { Actions } from "@ngrx/effects";
import { TranslationService } from "@core/translation.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EwaybillShipper } from "../ewaybill-view/ewaybill-shipper";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-outbox-not-confirmed-cancel",
	templateUrl: "./ewaybill-outbox-not-confirmed-cancel.component.html",
	styleUrls: ["./ewaybill-outbox-not-confirmed-cancel.component.scss"]
})

export class EwaybillOutboxNotConfirmedCancelComponent extends EwaybillShipper {
	constructor(
		private readonly userRoutingService: UserRoutingService,
		protected readonly activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		overlayService: OverlayService,
		ewaybillSelectorService: EwaybillSelectorService,
		actions: Actions,
		translationService: TranslationService,
		router: Router
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);
	}

	public goBack(): void {
		console.log(1);
		this.userRoutingService.navigateBack();
		console.log(2);
	}
}
