import { EwaybillView } from "./ewaybill-view";
import { ActivatedRoute, Router } from "@angular/router";
import { EwaybillState } from "../ewaybill.reducer";
import { Store } from "@ngrx/store";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { OverlayService } from "@core/overlay.service";
import { TranslationService } from "@core/translation.service";
import { createRegistry } from "@app/user/user.actions";
import * as EwaybillActions from "@app/user/documents/ewaybill/ewaybill.actions";
import { Actions, ofType } from "@ngrx/effects";
import { DraftType } from "@helper/abstraction/draft";
import { take, skip, takeUntil, first } from "rxjs/operators";
import { EwaybillSharedCreatePopupComponent } from "../../ewaybill-create-popup/ewaybill-shared-create-popup.component";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { getSignedAndCanceledDraftThenSaveDraft } from "../ewaybill-cancel/ewaybill-cancel.actions";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { TimeUtil } from "@helper/time-util";

export abstract class EwaybillShipper extends EwaybillView {
	public cancelingStatus$: Observable<"ERROR" | "PENDING" | "OK" | undefined>;
	public TimeUtil = TimeUtil;

	constructor(
		activatedRoute: ActivatedRoute,
		store: Store<EwaybillState>,
		ewaybillSelectorService: EwaybillSelectorService,
		overlayService: OverlayService,
		translationService: TranslationService,
		actions: Actions,
		router: Router
	) {
		super(activatedRoute, store, ewaybillSelectorService, overlayService, translationService, actions, router);
		this.cancelingStatus$ = this.ewaybillSelectorService.select$(state => state.cancelingStatus);
	}

	public createRegistry(): void {
		this.store.dispatch(createRegistry(this.id));
	}


	public createEwaybill(): void {
		const inputs = {
			route: this.activatedRoute,
			onCreateFn: (params: { draftType: DraftType; isTest: boolean }): void => {
				this.store.dispatch(EwaybillActions.createEwaybillFromEwaybill({
					sourceDocumentType: this.type,
					destinationDocumentType: params.draftType,
					id: +this.id,
					testIndicator: false
				}));
				this.overlayService.clear();
				this.actions.pipe(ofType(EwaybillActions.createEwaybillFromEwaybillSuccess), take(1)).subscribe(ewaybill => {
					this.router.navigateByUrl(
						this.router.createUrlTree(["/user/documents/EWAYBILL/edit"], {
							queryParams: {
								draftId: ewaybill.newDocument.id,
								draftType: params.draftType
							}
						})
					);
				});
			}
		};

		const component = this.overlayService.show(EwaybillSharedCreatePopupComponent, {
			inputs,
			centerPosition: true
		});
		component.instance.close$.subscribe(() => {
			this.overlayService.clear();
		});
	}

	public cancel(ewaybill: Ewaybill): void {
		if (ewaybill.id && ewaybill.msgType) {
			this.ewaybillSelectorService.select$(state => state.cancelError).pipe(
				skip(1),
				take(1),
				takeUntil(this.unsubscribe$$)
			).subscribe(e => {
				if (e instanceof HttpErrorResponse) {
					this.cancelErrorHandler(e);
				}
			});

			this.cancelingStatus$.pipe(
				skip(1),
				first(status => status === "OK"),
				takeUntil(this.unsubscribe$$)
			).subscribe(() => this.goBack());

			this.store.dispatch(getSignedAndCanceledDraftThenSaveDraft({
				draftType: ewaybill.msgType,
				document: ewaybill,
				documentId: ewaybill.id.toString()
			}));
		}
	}

	private cancelErrorHandler(error: HttpErrorResponse): void {
		let errorMessage: string;
		const proxyUnavailableMessage = this.translationService.getTranslation("proxyUnavailable");
		switch (true) {
			case error.status === 422:
				errorMessage = error.error && typeof error.error.error === "string" ? error.error.error : error.error.message;
				break;
			case error.status === 0 && !!proxyUnavailableMessage:
				errorMessage = proxyUnavailableMessage;
				break;
			default:
				errorMessage = error.error && typeof error.error.error === "string" ? error.error.error : error.message;
				break;
		}

		this.overlayService.showNotification$(errorMessage, "error");
	}

	public abstract goBack(): void;
}
