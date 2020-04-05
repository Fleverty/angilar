import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { EwaybillState } from "../ewaybill.reducer";
import { Router, ActivatedRoute } from "@angular/router";
import * as EwaybillActions from "../ewaybill.actions";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { takeUntil, take } from "rxjs/operators";
import { OverlayService } from "@core/overlay.service";
import { Actions, ofType } from "@ngrx/effects";
import { confirmEwaybillReceiptSuccess } from "../ewaybill.actions";
import { TranslationService } from "@core/translation.service";
import { documentState } from "@helper/paths";
import { EwaybillReceiver } from "../ewaybill-view/ewaybill-receiver";

@Component({
	selector: "app-ewaybill-inbox-created-cancel-sent",
	templateUrl: "./ewaybill-inbox-created-cancel-sent.component.html",
	styleUrls: ["./ewaybill-inbox-created-cancel-sent.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillInboxCreatedCancelSentComponent extends EwaybillReceiver {
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
		if (this.ewaybill) {
			this.confirmCancel();
		}
	}

	private confirmCancel(): void {
		const id = this.ewaybill.cancelDocument && this.ewaybill.cancelDocument.id;
		if (id && Number.isFinite(id)) {
			this.store.dispatch(EwaybillActions.confirmEwaybillReceipt(id));
			this.actions.pipe(
				ofType(EwaybillActions.confirmEwaybillReceiptSuccess),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => this.goBack());
		}
	}
}
