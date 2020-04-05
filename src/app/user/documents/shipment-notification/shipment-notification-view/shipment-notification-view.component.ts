import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { ShipmentNotification } from "@helper/abstraction/shipment-notification";
import { DraftEffects } from "@app/user/documents/draft.effects";
import { ActivatedRoute, Router } from "@angular/router";
import { ShipmentNotificationSelectorService } from "@app/user/documents/shipment-notification/shipment-notification-selector.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { notNull } from "@helper/operators";
import { ShipmentNotificationsState } from "@app/user/documents/shipment-notification/shipment-notification.reducer";
import { Store } from "@ngrx/store";
import { EwaybillCreatePopupComponent } from "@app/user/documents/ewaybill-create-popup/ewaybill-create-popup.component";
import { exportXMLDocuments } from "@app/user/user.actions";
import { documentState } from "@helper/paths";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-shipment-notification-view",
	templateUrl: "./shipment-notification-view.component.html",
	styleUrls: ["./shipment-notification-view.component.scss"]
})
export class ShipmentNotificationViewComponent implements OnDestroy {
	public get document(): ShipmentNotification {
		return this.activatedRoute.snapshot.data.document;
	}

	public get documentId(): string | undefined {
		return this.activatedRoute.snapshot.params.id;
	}

	public get status(): documentState.incoming | documentState.outgoing | undefined {
		return this.activatedRoute.snapshot.data.status;
	}

	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly draftEffects: DraftEffects,
		private readonly overlayService: OverlayService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly router: Router,
		private readonly store: Store<ShipmentNotificationsState>,
		private readonly shipmentNotificationSelectorService: ShipmentNotificationSelectorService
	) {
		this.shipmentNotificationSelectorService.select$(state => state.error).pipe(
			takeUntil(this.unsubscribe$$),
			notNull()
		).subscribe(error => {
			this.overlayService.showNotification$(error.message, "error");
		});
	}

	public back(): void {
		this.router.navigate(["user", "documents", "DESADV", this.status]);
	}

	public export(): void {
		const docId = this.documentId && +this.documentId;
		if (docId)
			this.store.dispatch(exportXMLDocuments({ documentType: "DESADV", documentIds: [docId] }));
	}

	public createEwaybill(): void {
		const route = this.activatedRoute;
		const component = this.overlayService.show(EwaybillCreatePopupComponent, { inputs: { route }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
		this.overlayService.clear();
	}
}
