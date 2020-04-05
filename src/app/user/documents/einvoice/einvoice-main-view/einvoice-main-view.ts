import { ActivatedRoute, Router } from "@angular/router";
import { OverlayService } from "@core/overlay.service";
import { Actions, ofType } from "@ngrx/effects";
import { EinvoiceState } from "../einvoice.reducer";
import { Einvoice } from "@helper/abstraction/einvoice";
import { Store } from "@ngrx/store";
import * as EinvoiceMainActions from "./../einvoice-actions/einvoice-main.actions";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { TranslationService } from "@core/translation.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { exportXLSXDocuments, exportXMLDocuments, exportXLSXDocumentsError, exportXMLDocumentsError } from "@app/user/user.actions";
import { OnDestroy } from "@angular/core";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

export class EinvoiceMainView implements OnDestroy {
	public get einvoice(): Einvoice {
		return this.activatedRoute.snapshot.data.document;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	protected unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(
		protected readonly userRoutingService: UserRoutingService,
		protected readonly activatedRoute: ActivatedRoute,
		protected readonly store: Store<EinvoiceState>,
		protected readonly overlayService: OverlayService,
		protected readonly actions: Actions,
		protected readonly router: Router,
		protected readonly einvoiceSelectorService: EinvoiceSelectorService,
		protected readonly translationService: TranslationService,
	) { }

	public checkEDS(): void {
		this.store.dispatch(EinvoiceMainActions.checkSign({ documentId: this.id }));

		const sub = this.actions.pipe(
			ofType(EinvoiceMainActions.checkSignSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(value => {
			if (value) {
				const message: string = this.translationService.getTranslation("checkSignOK");
				this.overlayService.showNotification$(message, "success");
			} else {
				const message: string = this.translationService.getTranslation("checkSignError");
				this.overlayService.showNotification$(message, "error");
			}
			sub.unsubscribe();
		});
	}

	public exportXML(): void {
		this.store.dispatch(exportXMLDocuments({
			documentType: "BLRINV",
			documentIds: [+this.id]
		}));

		const sub = this.actions.pipe(
			ofType(exportXMLDocumentsError),
			takeUntil(this.unsubscribe$$)
		).subscribe(error => {
			if (error && error.error)
				this.overlayService.showNotification$(error.error.message, "error");
			sub.unsubscribe();
		});
	}

	public exportXSLX(): void {
		this.store.dispatch(exportXLSXDocuments({
			documentType: "EINVOICE",
			documentIds: [+this.id]
		}));

		const sub = this.actions.pipe(
			ofType(exportXLSXDocumentsError),
			takeUntil(this.unsubscribe$$)
		).subscribe(error => {
			if (error && error.error)
				this.overlayService.showNotification$(error.error.message, "error");
			sub.unsubscribe();
		});
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.overlayService.clear();
		this.store.dispatch(EinvoiceMainActions.resetEinvoice());
	}
}
