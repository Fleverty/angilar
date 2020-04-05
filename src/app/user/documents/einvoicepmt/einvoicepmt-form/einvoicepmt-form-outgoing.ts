import { EinvoicepmtForm } from "@app/user/documents/einvoicepmt/einvoicepmt-form/einvoicepmt-form";
import { Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { OverlayService } from "@core/overlay.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { TranslationService } from "@core/translation.service";

export class EinvoicepmtFormOutgoing extends EinvoicepmtForm {
	constructor(
		protected readonly store: Store<EinvoicepmtState>,
		protected readonly overlayService: OverlayService,
		protected readonly userRoutingService: UserRoutingService,
		protected readonly translationService: TranslationService
	) {
		super(store, overlayService, userRoutingService, translationService);
	}
}
