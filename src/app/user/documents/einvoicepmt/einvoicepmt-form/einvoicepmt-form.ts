import * as EinvoicepmtActions from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.actions";
import { createSelector, select, Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { OverlayService } from "@core/overlay.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { exportXLSXDocuments, exportXMLDocuments } from "@app/user/user.actions";
import { filter, take } from "rxjs/operators";
import { TranslationService } from "@core/translation.service";

export class EinvoicepmtForm {
	constructor(
		protected readonly store: Store<EinvoicepmtState>,
		protected readonly overlayService: OverlayService,
		protected readonly userRoutingService: UserRoutingService,
		protected readonly translationService: TranslationService
	) { }

	public checkSign(id: string): void {
		this.store.dispatch(EinvoicepmtActions.resetStatusOfCheckSign());
		if (id) {
			this.store.dispatch(EinvoicepmtActions.checkSign({ documentId: id }));

			const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
			const selectStatusOfCheckSign = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): boolean | undefined => state.statusOfCheckSign);
			this.store.pipe(select(selectStatusOfCheckSign)).pipe(
				filter(e => e !== undefined),
				take(1)
			).subscribe((value: boolean | undefined) => {
				if (value) {
					const message: string = this.translationService.getTranslation("checkSignOK");
					this.overlayService.showNotification$(message, "success");
				} else {
					const message: string = this.translationService.getTranslation("checkSignError");
					this.overlayService.showNotification$(message, "error");
				}
			});
		}
	}

	public export(config: { id: string; type: "XSLX" | "XML"}): void {
		if (!config)
			throw new Error("Please provide config with exported id and type");
		if (config.id)
			switch (config.type) {
				case "XML": {
					this.store.dispatch(exportXMLDocuments({
						documentType: "BLRPMT",
						documentIds: [+config.id]
					}));
					break;
				}
				case "XSLX": {
					this.store.dispatch(exportXLSXDocuments({
						documentType: "EINVOICEPMT",
						documentIds: [+config.id]
					}));
					break;
				}
			}
	}

	public prevPage(): void {
		this.userRoutingService.navigateBack();
	}

	public ngOnDestroy(): void {
		this.overlayService.clear();
	}
}
