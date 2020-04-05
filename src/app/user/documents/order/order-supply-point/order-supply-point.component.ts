import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Storage } from "@helper/abstraction/storages";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
	selector: "app-order-supply-point",
	templateUrl: "./order-supply-point.component.html",
	styleUrls: ["../form.scss", "./order-supply-point.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSupplyPointComponent {
	@Input() public readonly form?: FormGroup;
	@Input() public readonly storages: [Storage, string][] = [];
	@Output() private readonly filterChanged: EventEmitter<string | void> = new EventEmitter<string | void>();
	private unsubscribe$$ = new Subject<void>();

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((storage: Storage) => {
				this.form && this.form.patchValue({
					deliveryPointId: storage && storage.id || null,
					deliveryPointAddress: storage && storage.addressFull || null,
					deliveryPointGln: storage && storage.gln || null,
					deliveryPointName: storage && storage.storageName || null
				}, { emitEvent: false });
			});
	}

	public filterChangeHandler(filter?: { search: string }): void {
		if (filter)
			this.filterChanged.emit(filter.search);
		else
			this.filterChanged.emit();
	}

	public transformFn(storage: Storage): [Storage, string] {
		return [storage, `${storage.addressFull || ""} ${storage.storageName || ""}`];
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
