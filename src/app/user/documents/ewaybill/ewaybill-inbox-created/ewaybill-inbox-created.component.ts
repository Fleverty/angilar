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
import { EwaybillShipper } from "../ewaybill-view/ewaybill-shipper";

@Component({
	selector: "app-ewaybill-inbox-created",
	templateUrl: "./ewaybill-inbox-created.component.html",
	styleUrls: ["./ewaybill-inbox-created.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillInboxCreatedComponent extends EwaybillShipper {
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
			this.confirmResponse();
		}
	}

	private confirmResponse(): void {
		const id = this.ewaybill.responseDocument && this.ewaybill.responseDocument.id;
		if (id && Number.isFinite(id)) {

			this.store.dispatch(EwaybillActions.confirmEwaybillResponse(id));
			this.actions.pipe(
				ofType(EwaybillActions.confirmEwaybillResponseSuccess),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => this.goBack());
		}
	}
}
