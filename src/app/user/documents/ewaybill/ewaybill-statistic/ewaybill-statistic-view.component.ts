import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { EwaybillState } from "../ewaybill.reducer";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { Location } from "@angular/common";
import { EwaybillView } from "../ewaybill-view/ewaybill-view";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-statistic-view",
	templateUrl: "./ewaybill-statistic-view.component.html",
	styleUrls: ["./ewaybill-statistic-view.component.scss"]
})

export class EwaybillStatisticViewComponent extends EwaybillView {
	constructor(
		private readonly location: Location,
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
		this.location.back();
	}
}
