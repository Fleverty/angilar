import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store, createSelector } from "@ngrx/store";
import { EwaybillState } from "../ewaybill.reducer";
import * as EwaybillActions from "../ewaybill.actions";
import { takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { TemplateUtil } from "@helper/template-util";
import { OverlayService } from "@core/overlay.service";
import { ValidatorsUtil } from "@helper/validators-util";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-ewaybill-edit-popup",
	templateUrl: "./ewaybill-edit-popup.component.html",
	styleUrls: ["./ewaybill-edit-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EwaybillEditPopupComponent extends DefaultPopupComponent implements OnInit {
	@Input() public id?: string;
	public form?: FormGroup;
	public signingStatus$: Observable<"PENDING" | "OK" | "ERROR">;
	public messages: Map<string, string> = new Map<string, string>();
	@ViewChild("texts", { static: true }) public texts?: ElementRef<HTMLTemplateElement>;

	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly actions$: Actions,
		private readonly router: Router,
		private readonly formBuilder: FormBuilder,
		private readonly store: Store<EwaybillState>,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly overlayService: OverlayService
	) {
		super();

		const selectState = (appState: any): EwaybillState => appState.ewaybill;
		const selector = createSelector(selectState, (state: EwaybillState): "PENDING" | "OK" | "ERROR" => state.signingStatus);
		this.signingStatus$ = this.store.select(selector);
	}

	public ngOnInit(): void {
		this.form = this.initForm();
	}

	public ngAfterViewInit(): void {
		if (!this.texts)
			throw Error("No template!");
		this.messages = TemplateUtil.getMap(this.texts.nativeElement);
	}

	public signAndSave(form: FormGroup): void {
		ValidatorsUtil.triggerValidation(form);
		if (form && form.invalid) {
			let m = "";
			m = this.messages.get("requiredChangeReason") || m;

			this.overlayService.showNotification$(m, "error");
			return;
		}

		this.store.dispatch(EwaybillActions.createEwaybillThenSign({ documentId: form.value.documentId, changeReason: form.value.changeReason }));

		// this.ewaybillSelectorService.select$((state): HttpErrorResponse | Error | undefined => state.errorCreateEwaybillThenSign).pipe(
		// 	skip(1),
		// 	take(1),
		// 	takeUntil(this.unsubscribe$$)
		// ).subscribe(
		// 	err => {
		// 		let m = "";
		// 		if (err && err instanceof HttpErrorResponse)
		// 			switch (err.status) {
		// 				case 422:
		// 					m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
		// 					break;
		// 				case 0:
		// 					m = this.messages.get("proxyUnavailable") || m;
		// 					break;
		// 				default:
		// 					m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
		// 					break;
		// 			}
		// 		this.overlayService.showNotification$(m, "error");
		// 	}
		// );

		this.actions$.pipe(
			ofType(EwaybillActions.saveSignedBLRAPNSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.prevPage());
	}

	public prevPage(): void {
		this.router.navigate(["user", "documents", "EWAYBILL", documentState.draft]);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private initForm(): FormGroup {
		return this.formBuilder.group({
			documentId: [this.id, Validators.required],
			changeReason: [null, Validators.required],
		});
	}
}
