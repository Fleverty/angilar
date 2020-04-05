import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EwaybillState } from "../ewaybill.reducer";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import * as EwaybillActions from "../ewaybill.actions";
import { takeUntil, skip, take } from "rxjs/operators";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TranslationService } from "@core/translation.service";
import { documentState } from "@helper/paths";
import { notNull } from "@helper/operators";
import { ofType, Actions } from "@ngrx/effects";
import { EwaybillShipper } from "../ewaybill-view/ewaybill-shipper";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-inbox-change-required-not-confirm",
	styleUrls: ["./ewaybill-inbox-change-required-not-confirm.component.scss"],
	templateUrl: "./ewaybill-inbox-change-required-not-confirm.component.html"
})

export class EwaybillInboxChangeRequiredNotConfirmComponent extends EwaybillShipper {
	constructor(
		router: Router,
		activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		overlayService: OverlayService,
		translationService: TranslationService,
		ewaybillSelectorService: EwaybillSelectorService,
		actions: Actions
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.incoming]);
	}

	public confirm(): void {
		const
			documentId = this.ewaybill && this.ewaybill.changeRequestList && this.ewaybill.changeRequestList.length && this.ewaybill.changeRequestList[0].id,
			type = this.activatedRoute.snapshot.params.type;
		if (documentId && Number.isFinite(documentId) && type) {
			this.ewaybillSelectorService.select$(state => state.confirmEwaybillReceipt2651Error).pipe(
				skip(1),
				take(1),
				notNull(),
				takeUntil(this.unsubscribe$$)
			).subscribe(message =>
				this.overlayService.showNotification$(message.error, "error")
			);

			this.actions.pipe(
				ofType(EwaybillActions.confirmEwaybillReceipt2651Success),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => {
				this.goBack();
			});
			this.store.dispatch(EwaybillActions.confirmEwaybillReceipt2651(documentId));
		}
	}
}
