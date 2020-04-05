import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { EwaybillState } from "../ewaybill.reducer";
import { OverlayService } from "@core/overlay.service";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { documentState } from "@helper/paths";
import { EwaybillShipper } from "../ewaybill-view/ewaybill-shipper";

@Component({
	selector: "app-ewaybill-inbox-change-required",
	templateUrl: "./ewaybill-inbox-change-required.component.html",
	styleUrls: ["./ewaybill-inbox-change-required.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillInboxChangeRequiredComponent extends EwaybillShipper {
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	constructor(
		activatedRoute: ActivatedRoute,
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
