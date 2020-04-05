import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { skip, take } from "rxjs/operators";
import { ShipmentNotificationsState } from "./shipment-notification.reducer";
import { ShipmentNotificationSelectorService } from "./shipment-notification-selector.service";
import { ShipmentNotification } from "./shipment-notification";
import { getShipmentNotificationDocument } from "./shipment-notification.actions";

@Injectable()
export class ShipmentNotificationsResolverService implements Resolve<ShipmentNotification | undefined> {
	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly shipmentNotificationSelectorService: ShipmentNotificationSelectorService,
		private readonly store: Store<ShipmentNotificationsState>,
	) { }

	public resolve(route: ActivatedRouteSnapshot): Observable<ShipmentNotification | undefined> {
		const id = route.paramMap.get("id");
		const docId = id && Number.isFinite(+id) ? +id : null;

		if (!docId)
			return of(undefined);

		let action = getShipmentNotificationDocument("DESADV", docId);
		if (typeof route.data.action === "function")
			action = route.data.action("DESADV", docId);

		this.store.dispatch(action);
		return this.shipmentNotificationSelectorService.select$(state => state.shipmentNotification).pipe(skip(1), take(1));
	}
}
