import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { resetEwaybill, deleteEwaybill, sendSignedEwaybillDraft } from "../ewaybill.actions";
import { EwaybillState } from "../ewaybill.reducer";
import { Ewaybill, EwaybillResponse } from "@helper/abstraction/ewaybill";
import { Draft as IDraft, DraftType } from "@helper/abstraction/draft";
import { HttpErrorResponse } from "@angular/common/http";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { documentState } from "@helper/paths";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-sign-draft",
	templateUrl: "./ewaybill-sign-draft.component.html",
	styleUrls: ["./ewaybill-sign-draft.component.scss"]
})

export class EwaybillSignDraftComponent {
	public get document(): EwaybillResponse {
		return this.activatedRoute.snapshot.data.document;
	}
	public get status(): string | undefined {
		return this.activatedRoute.snapshot.data.processingStatus;
	}
	public get draftId(): string {
		return this.activatedRoute.snapshot.params.id;
	}
	public get draftType(): DraftType {
		return this.activatedRoute.snapshot.params.type;
	}
	public draft?: IDraft<Ewaybill>;
	@Input() public buttonsDisable = false;
	private unsubscribe$$ = new Subject<void>();
	private texts?: Map<string, string>;
	@ViewChild("texts", { static: true, read: ElementRef }) private textsTemplate?: ElementRef;

	constructor(
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<DocumentsState>,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly userRoutingService: UserRoutingService,
		private readonly overlayService: OverlayService,
	) {
		this.ewaybillSelectorService.select$((state: EwaybillState): Error | HttpErrorResponse | undefined => state.sendingError).pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(error => {
			if (error)
				this.overlayService.showNotification$(error.message, "error");
		});
	}

	public prevPage(): void {
		if (this.router.url.split("/")[4] === "sign-draft")
			this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft]);
		else
			this.userRoutingService.navigateBack();
	}

	public send(): void {
		if (this.draftId && this.document && this.document.msgType) {
			this.store.dispatch(sendSignedEwaybillDraft({ draftId: this.draftId, draftType: this.document.msgType as DraftType }));
		}
	}

	public delete(): void {
		this.overlayService.showConfirmation$(
			this.texts && this.texts.get("deletionPopupText") || "",
			this.texts && this.texts.get("deletionPopupAgreeButton"),
			this.texts && this.texts.get("deletionPopupDisagreeButton")
		).then((state: boolean) => {
			if (state && this.draftType && this.draftId) {
				this.store.dispatch(deleteEwaybill(this.draftType, this.draftId));
			}
		});
	}

	public ngAfterViewInit(): void {
		if (this.textsTemplate)
			this.texts = TemplateUtil.getMap(this.textsTemplate.nativeElement);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.store.dispatch(resetEwaybill());
	}
}
