import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Einvoice } from "@helper/abstraction/einvoice";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
import { documentState } from "@helper/paths";
import { OverlayService } from "@core/overlay.service";
import { Store } from "@ngrx/store";
import * as EwaybillDeleteActions from "./../einvoice-actions/einvoice-delete.actions";
import { EinvoiceState } from "../einvoice.reducer";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as EwaybillSignedActions from "./../einvoice-actions/einvoice-signed.actions";
import { TemplateUtil } from "@helper/template-util";
import { resetEinvoice } from "../einvoice-actions/einvoice-main.actions";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-sign-draft",
	templateUrl: "./einvoice-sign-draft.component.html",
	styleUrls: ["./einvoice-sign-draft.component.scss"]
})

export class EinvoiceSignDraftComponent {
	public get document(): Einvoice {
		return this.activatedRoute.snapshot.data.document;
	}
	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	@Input() public buttonsDisable = false;
	private texts?: Map<string, string>;
	private unsubscribe$$ = new Subject<void>();
	@ViewChild("texts", { static: true, read: ElementRef }) private textsTemplate?: ElementRef;

	constructor(
		private readonly actions: Actions,
		private readonly store: Store<EinvoiceState>,
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly userRoutingService: UserRoutingService,
		private readonly overlayService: OverlayService,
	) {
		this.actions.pipe(
			ofType(
				EwaybillSignedActions.sendSignedEinvoiceDraftSuccess,
				EwaybillDeleteActions.deleteEinvoiceSuccess
			),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => {
			this.prevPage();
		});
	}

	public prevPage(): void {
		if (this.router.url.split("/")[4] === "sign-draft")
			this.router.navigate(["user", "documents", "EINVOICE", documentState.draft]);
		else
			this.userRoutingService.navigateBack();
	}

	public send(): void {
		if (this.id) {
			this.store.dispatch(EwaybillSignedActions.sendSignedEinvoiceDraft({ draftId: this.id, draftType: "BLRINV" }));
		}
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.texts && this.texts.get("deletionPopupText") || "",
			this.texts && this.texts.get("deletionPopupAgreeButton"),
			this.texts && this.texts.get("deletionPopupDisagreeButton")
		).then((state: boolean) => {
			if (state && this.id)
				this.store.dispatch(EwaybillDeleteActions.deleteEinvoice(this.id));
		});
	}

	public isDisabledSend(document: Einvoice): boolean {
		const сondition = (document.processingStatus === 98 || document.processingStatus === 99) && document.supplierSignature;
		if (сondition)
			return false;
		else
			return true;
	}

	public ngAfterViewInit(): void {
		if (this.textsTemplate)
			this.texts = TemplateUtil.getMap(this.textsTemplate.nativeElement);
	}

	public ngOnDestroy(): void {
		this.store.dispatch(resetEinvoice());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
