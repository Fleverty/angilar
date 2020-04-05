import { FormGroup } from "@angular/forms";
import { Component, ChangeDetectionStrategy, Input, OnDestroy, OnChanges, SimpleChanges } from "@angular/core";
import { GeneralGLN, GeneralGLNsDto, GeneralGLNsParams } from "@helper/abstraction/generalGLN";
import { takeUntil } from "rxjs/operators";
import { Subscription, Subject, Observable } from "rxjs";
import { LoadingPoint } from "@helper/abstraction/loading-points";
import { UnloadingPoint } from "@helper/abstraction/unload-points";
import { UserBackendService } from "@app/user/user-core/user-backend.service";
import { StoragesDto, TypedStoragesParams } from "@helper/abstraction/storages";
import { SelectBoxSelfFetchState } from "@shared/select-box-self-fetch/select-box-self-fetch.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-places-shipment-delivery",
	styleUrls: ["./einvoice-places-shipment-delivery.component.scss", "../einvoice-section.scss"],
	templateUrl: "./einvoice-places-shipment-delivery.component.html",
})

export class EinvoicePlacesShipmentDeliveryComponent implements OnChanges, OnDestroy {
	public showContent = true;
	@Input() public form?: FormGroup;
	@Input() public partnerId?: number;

	public loadingOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<StoragesDto> => {
			const params: TypedStoragesParams = {
				...selectBoxState,
				searchText: selectBoxState.search,
				documentTypeId: "EINVOICE",
				storageTypeId: "LOADING_PLACE"
			};
			return this.userBackendService.organization.storages.list.getByStorageType$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.storageName])
	};

	public unloadingOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<StoragesDto> => {
			const params: TypedStoragesParams = {
				...selectBoxState,
				searchText: selectBoxState.search,
				partnerId: this.partnerId,
				documentTypeId: "EINVOICE",
				storageTypeId: "UNLOADING_PLACE"
			};
			return this.userBackendService.organization.storages.list.getByStorageType$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, e.storageName])
	};


	public GLNOption = {
		getData$: (selectBoxState: SelectBoxSelfFetchState): Observable<GeneralGLNsDto> => {
			const params: GeneralGLNsParams = {
				...selectBoxState,
				searchText: selectBoxState.search,
			};
			return this.userBackendService.nsi.generalGLN.list.get$(params);
		},
		mapData: (data: any[]): [any, string][] => data.map(e => [e, `${e.gln}, ${e.address}`])
	};

	private loadingPointSubscription?: Subscription;
	private loadingPublicGlnSubscription?: Subscription;
	private loadingIsPublicGlnSubscription?: Subscription;
	private unloadingPointSubscription?: Subscription;
	private unloadingPublicGlnSubscription?: Subscription;
	private unloadingIsPublicGlnSubscription?: Subscription;
	private unsubscribe$$: Subject<void> = new Subject<void>();

	constructor(public readonly userBackendService: UserBackendService) { }

	public get loadingFormGroup(): FormGroup {
		const fg = this.form && this.form.get("loading");
		if (!fg) throw Error("No loading");
		return fg as FormGroup;
	}

	public get unloadingFormGroup(): FormGroup {
		const fg = this.form && this.form.get("unloading");
		if (!fg) throw Error("No unloading");
		return fg as FormGroup;
	}


	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.form && this.form) {

			this.resubscribeLoadingPoint();
			this.resubscribeUnloadingPoint();
		}
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public transformFn(value: any): [any, string] {
		return [value, value.address || ""];
	}

	public publicGLNTransformFn(value: any): [any, string] {
		return [value, `${value.address || ""} ${value.gln || ""}`];
	}

	private resubscribeLoadingPoint(): void {
		this.loadingPointSubscription && this.loadingPointSubscription.unsubscribe();
		this.loadingPublicGlnSubscription && this.loadingPublicGlnSubscription.unsubscribe();
		this.loadingIsPublicGlnSubscription && this.loadingIsPublicGlnSubscription.unsubscribe();

		this.loadingPointSubscription = this.loadingFormGroup.controls.loadingPoint.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((loadingPoint: LoadingPoint) => {
			if (!loadingPoint) {
				this.loadingFormGroup.patchValue({ address: null, gln: null });
				return;
			}
			this.loadingFormGroup.patchValue({ address: loadingPoint.addressFull, gln: loadingPoint.gln });
		});

		this.loadingPublicGlnSubscription = this.loadingFormGroup.controls.publicGln.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((publicGln: GeneralGLN) => {
			if (!publicGln) {
				this.loadingFormGroup.patchValue({ address: null, gln: null });
				return;
			}
			this.loadingFormGroup.patchValue({ address: publicGln.address, gln: publicGln.gln });
		});

		this.loadingIsPublicGlnSubscription = this.loadingFormGroup.controls.isPublicGln.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(isPublicGln => {
			if (isPublicGln) {
				this.loadingFormGroup.controls.loadingPoint.disable();
				this.loadingFormGroup.controls.publicGln.enable();
				this.loadingFormGroup.patchValue({ loadingPoint: null, address: null, gln: null });
			} else {
				this.loadingFormGroup.controls.publicGln.disable();
				this.loadingFormGroup.controls.loadingPoint.enable();
				this.loadingFormGroup.patchValue({ publicGln: null, address: null, gln: null });
			}
		});
	}

	private resubscribeUnloadingPoint(): void {
		this.unloadingPublicGlnSubscription && this.unloadingPublicGlnSubscription.unsubscribe();
		this.unloadingPointSubscription && this.unloadingPointSubscription.unsubscribe();
		this.unloadingIsPublicGlnSubscription && this.unloadingIsPublicGlnSubscription.unsubscribe();

		this.unloadingPointSubscription = this.unloadingFormGroup.controls.unloadingPoint.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((value: UnloadingPoint) => {
			if (!value) {
				this.unloadingFormGroup.patchValue({ address: null, gln: null });
				return;
			}
			this.unloadingFormGroup.patchValue({ address: value.addressFull, gln: value.gln });
		});

		this.unloadingPublicGlnSubscription = this.unloadingFormGroup.controls.publicGln.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe((publicGln: GeneralGLN) => {
			if (!publicGln) {
				this.unloadingFormGroup.patchValue({ address: null, gln: null });
				return;
			}
			this.unloadingFormGroup.patchValue({ address: publicGln.address, gln: publicGln.gln });
		});

		this.unloadingIsPublicGlnSubscription = this.unloadingFormGroup.controls.isPublicGln.valueChanges.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(isPublicGln => {
			if (isPublicGln) {
				this.unloadingFormGroup.controls.unloadingPoint.disable();
				this.unloadingFormGroup.controls.publicGln.enable();
				this.unloadingFormGroup.patchValue({ unloadingPoint: null, address: null, gln: null });
			} else {
				this.unloadingFormGroup.controls.publicGln.disable();
				this.unloadingFormGroup.controls.unloadingPoint.enable();
				this.unloadingFormGroup.patchValue({ publicGln: null, address: null, gln: null });
			}
		});
	}
}
