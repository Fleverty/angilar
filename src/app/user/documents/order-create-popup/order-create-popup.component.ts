import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-order-create-popup",
	templateUrl: "./order-create-popup.component.html",
	styleUrls: ["./order-create-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCreatePopupComponent extends DefaultPopupComponent {
	@Input() public activatedRoute?: ActivatedRoute;
	public form: FormGroup;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly router: Router
	) {
		super();
		this.form = this.formBuilder.group({
			draftType: ["ORDERS"],
			kind: ["220"]
		});

		this.form.valueChanges.pipe(
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(() =>
			[this.form.controls["type"], this.form.controls["kind"]].forEach(c => {
				c.setValidators([Validators.required]);
				c.updateValueAndValidity();
			})
		);
	}

	public create({ draftType, kind }: { draftType: string; kind: string }): void {
		this.router.navigate(["create"], {
			queryParams: {
				draftType,
				kind
			},
			relativeTo: this.activatedRoute
		}).then(() => this.close());
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.close();
	}
}
