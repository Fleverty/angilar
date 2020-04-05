import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EwaybillState } from "../ewaybill.reducer";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { takeUntil } from "rxjs/operators";
import * as EwaybillActions from "../ewaybill.actions";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { Actions, ofType } from "@ngrx/effects";
import { confirmEwaybillReceiptSuccess } from "../ewaybill.actions";
import { TranslationService } from "@core/translation.service";
import { documentState } from "@helper/paths";
import { EwaybillReceiver } from "../ewaybill-view/ewaybill-receiver";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-inbox-canceled",
	styleUrls: ["./ewaybill-inbox-canceled.component.scss"],
	templateUrl: "./ewaybill-inbox-canceled.component.html"
})

export class EwaybillInboxCanceledComponent extends EwaybillReceiver {
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

		this.actions.pipe(
			ofType(confirmEwaybillReceiptSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.goBack());
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.incoming]);
	}

	public confirm(): void {
		const
			documentId = (this.ewaybill.cancelDocument && this.ewaybill.cancelDocument.id) || +this.activatedRoute.snapshot.params.id,
			type = this.type;
		if (Number.isFinite(documentId) && type) {
			this.store.dispatch(EwaybillActions.confirmEwaybillReceipt(documentId));
		}
	}
}
