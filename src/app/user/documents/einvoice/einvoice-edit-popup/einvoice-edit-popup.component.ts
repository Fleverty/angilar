import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { TemplateUtil } from "@helper/template-util";
import { OverlayService } from "@core/overlay.service";
import { ValidatorsUtil } from "@helper/validators-util";
import { documentState } from "@helper/paths";
import { EinvoiceState } from "../einvoice.reducer";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import * as EinvoiceMain from "../einvoice-actions/einvoice-main.actions";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, skip, take } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
	selector: "app-einvoice-edit-popup",
	templateUrl: "./einvoice-edit-popup.component.html",
	styleUrls: ["./einvoice-edit-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EinvoiceEditPopupComponent extends DefaultPopupComponent implements OnInit {
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
		private readonly store: Store<EinvoiceState>,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
		private readonly overlayService: OverlayService
	) {
		super();

		const selectFn$ = this.einvoiceSelectorService.select$.bind(this.einvoiceSelectorService);
		this.signingStatus$ = selectFn$(state => state.signingStatus);
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

		this.store.dispatch(EinvoiceMain.creatEditedEinvoice({ id: form.value.id, changeReason: form.value.changeReason }));

		this.einvoiceSelectorService.select$((state): HttpErrorResponse | Error | undefined => state.creatingError).pipe(
			skip(1),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(
			err => {
				let m = "";
				if (err && err instanceof HttpErrorResponse)
					switch (err.status) {
						case 422:
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;
							break;
						case 0:
							m = this.messages.get("proxyUnavailable") || m;
							break;
						default:
							if (err.error && err.error.errorCode == "EX1001")
								return;
							m = err.error && typeof err.error.error === "string" ? err.error.error : err.message;
							break;
					}
				this.overlayService.showNotification$(m, "error");
			}
		);

		this.actions$.pipe(
			ofType(EinvoiceMain.saveSignedBlrapnEinvoiceSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => this.goBack());
	}

	public goBack(): void {
		this.router.navigate(["user", "documents", "EINVOICE", documentState.incoming]);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private initForm(): FormGroup {
		return this.formBuilder.group({
			id: [this.id, Validators.required],
			changeReason: [null, Validators.required],
		});
	}
}
