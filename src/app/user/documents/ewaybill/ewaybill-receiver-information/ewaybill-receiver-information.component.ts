import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Consignee } from "@helper/abstraction/consignee";
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";

@Component({
	selector: "app-ewaybill-receiver-information",
	templateUrl: "./ewaybill-receiver-information.component.html",
	styleUrls: ["./ewaybill-receiver-information.component.scss", "../ewaybill-default-component.scss"]
})
export class EwaybillReceiverInformationComponent implements OnInit {
	public showContent = true;
	@Input() public form?: FormGroup;
	@Input() public consignees: [Consignee, string][] = [];
	@Output() public appConsigneesFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output("appReceiverFormValueChanges") public valueChanges = new EventEmitter<any>();
	private unsubscribe$$: Subject<void> = new Subject<void>();
	private formValueChange?: Subscription;

	public ngOnInit(): void {
		this.form && this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((value: Consignee) => {
			this.form && this.form.patchValue({
				id: value && value.id,
				name: value && value.name,
				address: value && value.addressFull,
				unp: value && value.unp,
				gln: value && value.gln
			});
		});
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.form) {
			if (this.formValueChange)
				this.formValueChange.unsubscribe();
			if (this.form)
				this.formValueChange = this.form.valueChanges.subscribe(value => this.valueChanges.emit(value));
		}
	}


	public nextConsigneesPage(): void {
		this.appConsigneesFilterChanges.emit();
	}

	public onConsigneesFilterChanges(name: { search: string }): void {
		this.appConsigneesFilterChanges.emit(name.search);
	}

	public transformFn(value: any): [any, string] {
		return [value, value.name];
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
