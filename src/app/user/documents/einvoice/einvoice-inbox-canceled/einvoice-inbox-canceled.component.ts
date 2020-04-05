import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { OverlayService } from "@core/overlay.service";
import { takeUntil, take } from "rxjs/operators";
import { notNull } from "@helper/operators";
import { Actions, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { TemplateUtil } from "@helper/template-util";
import { TranslationService } from "@core/translation.service";
import { documentState } from "@helper/paths";
import { EinvoiceSupplier } from "../einvoice-main-view/einvoice-supplier";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import * as EinvoiceCancel from "../einvoice-actions/einvoice-cancel.actions";
import { Observable } from "rxjs";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-inbox-canceled",
	styleUrls: ["./einvoice-inbox-canceled.component.scss"],
	templateUrl: "./einvoice-inbox-canceled.component.html"
})

export class EinvoiceInboxCanceledComponent extends EinvoiceSupplier {
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	public confirmationStatus$: Observable<"PENDING" | "OK" | "ERROR" | undefined>;

	@ViewChild("texts", { static: true }) public texts?: ElementRef<HTMLTemplateElement>;
	public messages: Map<string, string> = new Map<string, string>();

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

		const selectFn$ = this.einvoiceSelectorService.select$.bind(this.einvoiceSelectorService);
		this.confirmationStatus$ = selectFn$(state => state.confirmationStatus);
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EINVOICE", documentState.incoming]);
	}

	public confirmCancel(): void {
		this.store.dispatch(EinvoiceCancel.resetConfirmationError());

		this.actions.pipe(
			ofType(EinvoiceCancel.saveSignedConfirmationCancellationSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.goBack());

		this.einvoiceSelectorService.select$(state => state.confirmationError).pipe(
			notNull(),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(error => {
			let m = "";
			if (error && error instanceof HttpErrorResponse)
				switch (error.status) {
					case 422:
						m = error.error && typeof error.error.error === "string" ? error.error.error : error.error.message;
						break;
					case 0:
						m = this.translationService.getTranslation("proxyUnavailable") || m;
						break;
					default:
						if (error.error && error.error.errorCode == "EX1001")
							return;

						m = error.error && typeof error.error.error === "string" ? error.error.error : error.message;
						break;
				}
			this.overlayService.showNotification$(m, "error");
		});

		this.store.dispatch(EinvoiceCancel.confirmCancelEinvoice(this.id));
	}

	public ngAfterViewInit(): void {
		if (!this.texts)
			throw Error("No template!");
		this.messages = TemplateUtil.getMap(this.texts.nativeElement);
	}
}
