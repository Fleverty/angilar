import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { createSelector, select, Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import {
	deleteEinvoicepmtDraft,
	sendSignedEinvoicepmtDraft
} from "../einvoicepmt-store/einvoicepmt.actions";
import { takeUntil } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { OverlayService } from "@core/overlay.service";
import { Subject } from "rxjs";
import { TemplateUtil } from "@helper/template-util";
import { EinvoicepmtForm } from "@app/user/documents/einvoicepmt/einvoicepmt-form/einvoicepmt-form";
import { TranslationService } from "@core/translation.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-signed-draft",
	templateUrl: "./einvoicepmt-signed-draft.component.html",
	styleUrls: ["./einvoicepmt-signed-draft.component.scss"]
})
export class EinvoicepmtSignedDraftComponent extends EinvoicepmtForm implements OnDestroy {
	@Input() public disableSend = false;
	public get document(): EinvoicepmtDto {
		return this.activatedRoute.snapshot.data.document;
	}
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	public get draftId(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	public texts: Map<string, string> = new Map<string, string>();
	@ViewChild("textsTemplate", { static: true, read: ElementRef }) private set textsTemplate(template: ElementRef) {
		if (template)
			this.texts = TemplateUtil.getMap(template.nativeElement);
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
		const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectEinvoicepmtSendingError = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): Error | HttpErrorResponse | undefined => state.sendingError);
		this.store.pipe(select(selectEinvoicepmtSendingError)).pipe(takeUntil(this.unsubscribe$$)).subscribe(error => {
			if (error)
				this.overlayService.showNotification$(error.message, "error");
		});
	}

	public send(): void {
		if (this.draftId && this.document)
			this.store.dispatch(sendSignedEinvoicepmtDraft({ draftType: "BLRPMT", draftId: this.draftId }));
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.texts && this.texts.get("deletionPopupText") || "",
			this.texts && this.texts.get("deletionPopupAgreeButton"),
			this.texts && this.texts.get("deletionPopupDisagreeButton")
		).then((state: boolean) => {
			if (state && this.document && this.draftId) {
				this.store.dispatch(deleteEinvoicepmtDraft(+this.draftId, "BLRPMT"));
			}
		});
	}

	public prevPage(): void {
		this.userRoutingService.navigateBack({ force: true, redirectTo: "user/documents/EINVOICEPMT/draft"});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}
}
