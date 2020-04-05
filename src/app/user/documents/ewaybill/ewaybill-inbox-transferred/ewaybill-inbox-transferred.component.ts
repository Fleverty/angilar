import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { EwaybillState } from "../ewaybill.reducer";
import { confirmEwaybillReceipt, confirmEwaybillReceiptSuccess } from "../ewaybill.actions";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil } from "rxjs/operators";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { OverlayService } from "@core/overlay.service";
import { documentState } from "@helper/paths";
import { TranslationService } from "@core/translation.service";
import { EwaybillReceiver } from "../ewaybill-view/ewaybill-receiver";

@Component({
	selector: "app-ewaybill-inbox-transferred",
	templateUrl: "./ewaybill-inbox-transferred.component.html",
	styleUrls: ["./ewaybill-inbox-transferred.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillTransferredInboxComponent extends EwaybillReceiver {
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

		const selectFn$ = this.ewaybillSelectorService.select$.bind(this.ewaybillSelectorService);
		this.signingStatus$ = selectFn$(state => state.signingStatus);

		this.actions.pipe(
			ofType(confirmEwaybillReceiptSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() =>
			this.router.navigate(["user", "documents", "EWAYBILL", documentState.incoming, "received", this.type, this.id])
		);
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.incoming]);
	}

	public confirm(): void {
		if (!Number.isFinite(+this.id))
			throw Error("No id!");
		this.store.dispatch(confirmEwaybillReceipt(+this.id));
	}
}
