import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Partner } from "@helper/abstraction/partners";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-buyer",
	templateUrl: "./shipment-notification-buyer.component.html",
	styleUrls: ["../form.scss", "./shipment-notification-buyer.component.scss"]
})
export class ShipmentNotificationBuyerComponent implements OnInit {
	@Input() public readonly form?: FormGroup;
	@Input() public readonly partners: [Partner, string][] = [];
	@Output() private readonly filterChanged: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() private readonly appBuyerIdChanged: EventEmitter<string> = new EventEmitter<string>();
	private unsubscribe$$ = new Subject<void>();

	public ngOnInit(): void {
		if (this.form)
			this.form.controls.buyerName.valueChanges.pipe(takeUntil(this.unsubscribe$$)).subscribe((partner: Partner) => {
				if (!partner) {
					this.form && this.form.reset({}, { emitEvent: false });
				}
				else {
					this.form && this.form.patchValue({
						buyerId: partner && partner.id || null,
						buyerGln: partner && partner.gln || null,
						buyerUnp: partner && partner.unp || null,
						buyerName: partner && partner.name
					}, { emitEvent: false });
				}
				this.appBuyerIdChanged.emit(partner ? partner.id : undefined);
				this.filterChanged.emit("");
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
