import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { Store } from "@ngrx/store";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { documentState } from "@helper/paths";
import { EwaybillReceiver } from "../ewaybill-view/ewaybill-receiver";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-inbox-received",
	templateUrl: "./ewaybill-inbox-received.component.html",
	styleUrls: ["./ewaybill-inbox-received.component.scss"]
})

export class EwaybillReceivedComponent extends EwaybillReceiver {
	constructor(
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
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.incoming]);
	}
}
