import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { Storage } from "@helper/abstraction/storages";
import { takeUntil } from "rxjs/operators";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-delivery-place",
	templateUrl: "./shipment-notification-delivery-place.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-delivery-place.component.scss"]
})
export class ShipmentNotificationDeliveryPlaceComponent implements OnInit {
	@Input() public readonly form?: FormGroup;
	@Input() public readonly storages: [Storage, string][] = [];
	@Output() private readonly filterChanged: EventEmitter<string | void> = new EventEmitter<string | void>();
	private unsubscribe$$ = new Subject<void>();

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.dictionary.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((storage: Storage) => {
				if (!storage)
					this.form && this.form.reset({}, { emitEvent: false });
				else
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
		return [storage, `${storage.addressFull || ""}  ${storage.storageName || ""}`];
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
