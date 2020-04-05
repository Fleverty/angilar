import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Partner } from "@helper/abstraction/partners";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
	selector: "app-order-supplier",
	templateUrl: "./order-supplier.component.html",
	styleUrls: ["../form.scss", "./order-supplier.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSupplierComponent {
	@Input() public readonly form?: FormGroup;
	@Input() public readonly suppliers: [Partner, string][] = [];
	@Output() private readonly filterChanged: EventEmitter<string | void> = new EventEmitter<string | void>();
	private unsubscribe$$ = new Subject<void>();

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.supplierName.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((partner: Partner) => {
				this.form && this.form.patchValue({
					supplierId: partner && partner.id || null,
					supplierGln: partner && partner.gln || null,
					supplierName: partner && partner.name
				}, { emitEvent: false });
			});
	}

	public filterChangeHandler(filter?: { search: string }): void {
		if (filter)
			this.filterChanged.emit(filter.search);
		else
			this.filterChanged.emit();
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
