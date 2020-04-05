import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Storage } from "@helper/abstraction/storages";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-shipment-place",
	templateUrl: "./shipment-notification-shipment-place.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-shipment-place.component.scss"]
})
export class ShipmentNotificationShipmentPlaceComponent implements OnInit {
	@Input() public readonly shipmentPlaces: [Storage, string][] = [];
	@Input() public readonly form?: FormGroup;
	@Output() private readonly filterChanged: EventEmitter<string | void> = new EventEmitter<string | void>();
	private unsubscribe$$ = new Subject<void>();

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((storage: Storage) => {
				if (!storage)
					this.form && this.form.reset({}, { emitEvent: false });
				this.form && this.form.patchValue({
					shipFromPointId: storage && storage.id || null,
					shipFromPointAddress: storage && storage.addressFull || null,
					shipFromPointGln: storage && storage.gln || null,
					shipFromPointName: storage && storage.storageName || null
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
		return [storage, `${storage.addressFull || ""}  ${storage.storageName || ""}`];
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
