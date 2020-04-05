import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { Actions } from "@ngrx/effects";
import { Einvoice } from "@helper/abstraction/einvoice";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceBuyer } from "../einvoice-main-view/einvoice-buyer";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-outbox-transferred",
	templateUrl: "./einvoice-outbox-transferred.component.html",
	styleUrls: ["./einvoice-outbox-transferred.component.scss"]
})

export class EinvoiceOutboxTransferredComponent extends EinvoiceBuyer {
	public get einvoice(): Einvoice {
		return this.activatedRoute.snapshot.data.document;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}

	protected unsubscribe$$ = new Subject<void>();
	constructor(
		userRoutingService: UserRoutingService,
		activatedRoute: ActivatedRoute,
		store: Store<EinvoiceState>,
		router: Router,
		overlayService: OverlayService,
		actions: Actions,
		einvoiceSelectorService: EinvoiceSelectorService,
		translationService: TranslationService,
	) {
		super(userRoutingService, activatedRoute, store, router, overlayService, actions, einvoiceSelectorService, translationService);
	}

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}
}
