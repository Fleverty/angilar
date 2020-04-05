import { FormGroup } from "@angular/forms";
import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { GeneralGLN } from "@helper/abstraction/generalGLN";
import { takeUntil } from "rxjs/operators";
import { Subscription, Subject } from "rxjs";
import { LoadingPoint } from "@helper/abstraction/loading-points";
import { UnloadingPoint } from "@helper/abstraction/unload-points";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-places-shipment-delivery",
	styleUrls: ["./ewaybill-places-shipment-delivery.component.scss", "../ewaybill-default-component.scss"],
	templateUrl: "./ewaybill-places-shipment-delivery.component.html",
})

export class EwaybillPlacesShipmentDeliveryComponent implements OnChanges, OnDestroy {
	public showContent = true;
	@Input() public form?: FormGroup;
	@Input() public generalGLNs: [GeneralGLN, string][] = [];
	@Input() public loadingPoints: [LoadingPoint, string][] = [];
	@Input() public unloadingPoints: [UnloadingPoint, string][] = [];

	@Output() public appGlnFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() public appLoadingPointFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();
	@Output() public appUnloadingPointFilterChanges: EventEmitter<string | void> = new EventEmitter<string | void>();

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

	private loadingPointSubscription?: Subscription;
	private loadingPublicGlnSubscription?: Subscription;
	private loadingIsPublicGlnSubscription?: Subscription;
	private unloadingPointSubscription?: Subscription;
	private unloadingPublicGlnSubscription?: Subscription;
	private unloadingIsPublicGlnSubscription?: Subscription;
	private unsubscribe$$: Subject<void> = new Subject<void>();

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

	public nextGLNPage(): void {
		this.appGlnFilterChanges.emit();
	}

	public onGLNFilterChanges(glnName: { search: string }): void {
		this.appGlnFilterChanges.emit(glnName.search);
	}

	public nextLoadingPointsPage(): void {
		this.appLoadingPointFilterChanges.emit();
	}

	public onLoadingPointsFilterChanges(storageName: { search: string }): void {
		this.appLoadingPointFilterChanges.emit(storageName.search);
	}

	public nextUnloadingPointsPage(): void {
		this.appUnloadingPointFilterChanges.emit();
	}

	public onUnloadingPointsFilterChanges(storageName: { search: string }): void {
		this.appUnloadingPointFilterChanges.emit(storageName.search);
	}

	public transforFn(value: any): [any, string] {
		return [value, value.address || ""];
	}

	public publicGLNTransforFn(value: any): [any, string] {
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
