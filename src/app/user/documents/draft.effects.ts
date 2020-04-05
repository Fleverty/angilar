import { Injectable } from "@angular/core";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { ShipmentNotification } from "@helper/abstraction/shipment-notification";
import { DraftType } from "@helper/abstraction/draft";
import { Observable } from "rxjs";

@Injectable()
export class DraftEffects {

	constructor(private readonly userBackendService: UserBackendService) { }

	public getEwaybillDraft(draftId: string, draftType: DraftType): Observable<Ewaybill> {
		return this.userBackendService.draft.find.get$(draftType, draftId);
	}

	public getShipmentNotificationDraft(draftId: string): Observable<ShipmentNotification> {
		return this.userBackendService.draft.find.get$("DESADV", draftId);
	}
}
