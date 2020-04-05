import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from "@angular/core";
import { createSelector, select, Store } from "@ngrx/store";
import { CustomizationState } from "@app/user/customization/customization.reducer";
import * as CustomizationActions from "../../customization.actions";
import { Storage } from "@helper/abstraction/storages";
import { Observable, Subject } from "rxjs";
import { OverlayService } from "@core/overlay.service";
import { filter, takeUntil } from "rxjs/operators";
import { TemplateUtil } from "@helper/template-util";
import { StorageCreatePopupComponent } from "../storage-create-popup/storage-create-popup.component";
import { DocumentProperty } from "@helper/abstraction/documents";
import { ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";

@Component({
	selector: "app-storages",
	templateUrl: "./storages.component.html",
	styleUrls: ["./storages.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoragesComponent implements OnInit {
	public storages$: Observable<Storage[]>;
	public headProperties: DocumentProperty[] = [];
	public selectedStorages: Storage[] = [];
	private readonly unsubscribe$$ = new Subject<void>();
	private texts: Map<string, string> = new Map();
	@ViewChild("headerProperties", { static: true, read: ElementRef }) private readonly propertiesTemplate?: ElementRef;
	@ViewChild("texts", { static: true, read: ElementRef }) private set textsTemplate(element: ElementRef) {
		this.texts = TemplateUtil.getMap(element.nativeElement);
	}
	private storagesLoaded?: boolean;
	private size = 100;
	private page = 1;

	constructor(
		private readonly actions$: Actions,
		private readonly store: Store<CustomizationState>,
		private activatedRoute: ActivatedRoute,
		private readonly overlayService: OverlayService
	) {
		const selectStorages = (appState: any): CustomizationState => appState.customization;
		const storagesSelector = createSelector(selectStorages, (data: CustomizationState) => data.storages);
		this.storages$ = this.store.pipe(select(storagesSelector));

		const storagesLoaded = createSelector(selectStorages, (data: CustomizationState) => data.storagesLoaded);
		this.store.pipe(
			select(storagesLoaded),
			takeUntil(this.unsubscribe$$)
		).subscribe(storagesLoaded => this.storagesLoaded = storagesLoaded);

		const needConfirmationGLNSelector = createSelector(selectStorages, (data: CustomizationState) => data.needConfirmGLN);
		this.store.pipe(select(needConfirmationGLNSelector), filter((e: string[] | undefined) => !!e), takeUntil(this.unsubscribe$$)).subscribe((glns: string[] | undefined) => {
			this.overlayService.showConfirmation$(`${this.texts.get("msgFirstPart")} ${glns} ${this.texts.get("msgSecondPart")}`, this.texts.get("confirmText")).then((state: boolean) => {
				if (state)
					this.store.dispatch(CustomizationActions.confirmDeletingStorages(this.selectedStorages));
				else
					this.store.dispatch(CustomizationActions.unConfirmDeletingStorages());
				this.overlayService.clear();
			});
		});

		this.actions$.pipe(
			ofType(CustomizationActions.saveStorageSuccess),
			takeUntil(this.unsubscribe$$)
		).subscribe(() => {
			this.store.dispatch(CustomizationActions.resetStorages());
			this.store.dispatch(CustomizationActions.getStorages({ page: 1, size: 100 }));
		});
	}

	public readonly trackByFn = (index: number, item: Storage): any => item.id;

	public ngOnInit(): void {
		this.store.dispatch(CustomizationActions.getStorages({ page: this.page, size: this.size }));
	}

	public ngAfterViewInit(): void {
		if (!this.propertiesTemplate)
			throw Error("No ropertiesTemplate");
		const parsedTemplate = TemplateUtil.getNestedStructure(this.propertiesTemplate.nativeElement);
		this.headProperties = Object.keys(parsedTemplate).map(e => parsedTemplate[e]);
	}

	public deleteSingleStorageHandler(storage: Storage[]): void {
		this.selectedStorages = storage;
		this.store.dispatch(CustomizationActions.deleteStorages(storage));
	}

	public selectStoragesHandler(storages: Storage[] | null): void {
		this.selectedStorages = storages || [];
	}

	public deleteSelectedStoragesHandler(): void {
		if (!this.selectedStorages.length) {
			this.overlayService.showNotification$(this.texts.get("deleteError") || "", "error");
			return;
		}
		this.store.dispatch(CustomizationActions.deleteStorages(this.selectedStorages));
	}

	public openPopup(): void {
		this.store.dispatch(CustomizationActions.openPopupSaveStorage());
		const component = this.overlayService.show(StorageCreatePopupComponent, { inputs: { route: this.activatedRoute }, centerPosition: true });
		component.instance.close$.pipe(takeUntil(this.unsubscribe$$)).subscribe(() => this.overlayService.clear());
	}

	public ngOnDestroy(): void {
		this.store.dispatch(CustomizationActions.resetStorages());
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	public nextPage(): void {
		if (!this.storagesLoaded) {
			this.page += 1;
			this.store.dispatch(CustomizationActions.getStorages({ page: this.page, size: this.size }));
		}
	}
}
