import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, ChangeDetectionStrategy, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultPopupComponent } from "../../../shared/overlay/default-pop-up.component";
import { CreateDocumentParams } from "@helper/abstraction/documents";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-create-popup",
	styleUrls: ["./ewaybill-create-popup.component.scss"],
	templateUrl: "./ewaybill-create-popup.component.html",
})

export class EwaybillCreatePopupComponent extends DefaultPopupComponent implements OnInit {

	@Input() public route?: ActivatedRoute;

	public form?: FormGroup;
	public onCreateClicked = false;

	constructor(private fb: FormBuilder, private router: Router) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onCreate(): void {
		if (!this.form)
			throw Error("No form! ");
		this.onCreateClicked = true;
		const params: CreateDocumentParams = this.form.getRawValue();
		if (this.form.valid) {
			const queryParams = params.isTest ? {
				draftType: params.draftType,
				isTest: 1
			} : {
				draftType: params.draftType
			};
			this.router.navigateByUrl(
				this.router.createUrlTree(["/user/documents/EWAYBILL/create"], {
					queryParams
				})
			).then(() => this.close());
		}
	}

	private initForm(): void {
		this.form = this.fb.group({
			draftType: ["BLRWBL", Validators.required],
			isTest: false,
		});
	}
}
