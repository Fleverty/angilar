import { EwaybillView } from "./ewaybill-view";
import { ActivatedRoute, Router } from "@angular/router";
import { EwaybillState } from "../ewaybill.reducer";
import { Store } from "@ngrx/store";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { EwaybillEditPopupComponent } from "../ewaybill-edit-popup/ewaybill-edit-popup.component";
import * as EwaybillActions from "@app/user/documents/ewaybill/ewaybill.actions";
import { Actions } from "@ngrx/effects";
import { takeUntil } from "rxjs/operators";
import { Observable } from "rxjs";
import { ViewChild } from "@angular/core";
import { OverlayComponent } from "@shared/overlay/overlay.component";

export abstract class EwaybillReceiver extends EwaybillView {
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR">;
	@ViewChild("editPopup", { static: false }) private overlayComponent?: OverlayComponent;

	constructor(
		activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		ewaybillSelectorService: EwaybillSelectorService,
		overlayService: OverlayService,
		translationService: TranslationService,
		protected readonly actions: Actions,
		protected readonly router: Router
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);

		this.signingStatus$ = this.ewaybillSelectorService.select$(state => state.signingStatus);
	}

	public edit(): void {
		if (!this.id)
			throw Error("No ewaybillId");
		if (!this.overlayComponent) {
			throw Error("No overlay component");
		}

		const component = this.overlayComponent.show(EwaybillEditPopupComponent, { inputs: { id: this.id }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayComponent && this.overlayComponent.destroy());
	}

	public process(): void {
		if (this.id && this.type) {
			this.store.dispatch(EwaybillActions.processReceivedEwaybill({
				documentType: this.type,
				responseId: this.id,
			}));
		} else {
			throw Error("No params");
		}
	}

	public abstract goBack(): void;
}
