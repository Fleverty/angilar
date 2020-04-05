import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ShipmentNotificationsState } from "./shipment-notification.reducer";
import { UserSelector } from "@app/user/user-core/user-selector";

@Injectable()
export class ShipmentNotificationSelectorService extends UserSelector<ShipmentNotificationsState> {
	constructor(protected readonly store: Store<ShipmentNotificationsState>) {
		super(store);
	}

	public selectFn = (appState: any): ShipmentNotificationsState => appState.shipmentNotifications;
}
