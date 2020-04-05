import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EwaybillReceiver } from "../ewaybill-view/ewaybill-receiver";
import { Actions } from "@ngrx/effects";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-outbox-change-required",
	templateUrl: "./ewaybill-outbox-change-required.component.html",
	styleUrls: ["./ewaybill-outbox-change-required.component.scss"]
})

export class EwaybillOutboxChangeRequiredComponent extends EwaybillReceiver {
	constructor(
		private readonly userRoutingService: UserRoutingService,
		protected readonly activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		overlayService: OverlayService,
		ewaybillSelectorService: EwaybillSelectorService,
		translationService: TranslationService,
		actions: Actions,
		router: Router
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);
	}

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}
}
