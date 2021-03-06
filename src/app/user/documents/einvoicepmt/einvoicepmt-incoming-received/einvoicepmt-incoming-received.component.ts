import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { ActivatedRoute } from "@angular/router";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { Subject } from "rxjs";
import { EinvoicepmtFormIncoming } from "@app/user/documents/einvoicepmt/einvoicepmt-form/einvoicepmt-form-incoming";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-incoming-received",
	templateUrl: "./einvoicepmt-incoming-received.component.html",
	styleUrls: ["./einvoicepmt-incoming-received.component.scss"]
})
export class EinvoicepmtIncomingReceivedComponent extends EinvoicepmtFormIncoming implements OnDestroy {
	public get document(): EinvoicepmtDto {
		return this.activatedRoute.snapshot.data.document;
	}
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		protected readonly userRoutingService: UserRoutingService,
		protected readonly store: Store<EinvoicepmtState>,
		protected readonly overlayService: OverlayService,
		protected readonly translationService: TranslationService
	) {
		super(store, overlayService, userRoutingService, translationService);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
