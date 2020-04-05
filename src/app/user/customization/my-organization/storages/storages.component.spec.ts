/* tslint:disable:no-unused-variable */
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { StoragesComponent } from "./storages.component";
import { SharedModule } from "@shared/shared.module";
import { Store, StoreModule } from "@ngrx/store";
import { ReactiveFormsModule } from "@angular/forms";
import { OverlayService } from "@core/overlay.service";
import { CommonModule } from "@angular/common";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, of } from "rxjs";
import { StoragesGridComponent } from "@app/user/customization/my-organization/storages-grid/storages-grid.component";
import { Storage } from "@helper/abstraction/storages";

describe("StoragesComponent", () => {
	let component: StoragesComponent;
	let fixture: ComponentFixture<StoragesComponent>;
	let actions: Observable<any>;

	const storeMock = {
		storages$: of([]),
		pipe: (): any => {
			return of([]);
		},
		filter: (e: any): any => {
			return e;
		},
		dispatch(): void {
			//empty
		}
	};

	const popupServiceStub = {
		open: (): void => { }
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				ReactiveFormsModule,
				CommonModule,
				StoreModule.forRoot([], {
					runtimeChecks: {
						strictStateImmutability: true,
						strictActionImmutability: true,
						strictStateSerializability: false,
						strictActionSerializability: false,
					},
				})],
			declarations: [
				StoragesComponent,
				StoragesGridComponent
			],
			providers: [
				provideMockActions(() => actions),
				{ provide: OverlayService, useValue: popupServiceStub },
				{ provide: Store, useValue: storeMock },
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(StoragesComponent);
		component = fixture.componentInstance;
		component.storages$ = storeMock.storages$;
		fixture.detectChanges();
	});

	afterEach(() => { fixture.destroy(); });

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should set selected storages", () => {
		const storages: Storage[] = [
			{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" },
			{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" }
		];
		const expectedStorages: Storage[] = [
			{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" },
			{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" }
		];
		component.selectStoragesHandler(storages);
		expect(component.selectedStorages).toEqual(expectedStorages);
	});

	it("should dispatch deleteStorage action", () => {
		inject([Store], (store: Store<any>) => {
			const spy = spyOn(store, "dispatch");
			const storages: Storage[] = [
				{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" },
				{ id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" }
			];
			component.selectedStorages = storages;
			component.deleteSelectedStoragesHandler();
			const action: string = spy.calls.first().args[0].type;
			expect(action).toBe("[Customization] Delete Storages");
		});
	});

	it("should dispatch deleteStorage action with single storage", () => {
		inject([Store], (store: Store<any>) => {
			const spy = spyOn(store, "dispatch");
			const deletedStorage: Storage = { id: 1, state: true, addressFull: "address", removalRequest: true, verified: true, storageName: "name", gln: "123" };
			component.deleteSingleStorageHandler([deletedStorage]);
			const action: string = spy.calls.first().args[0].type;
			expect(action).toBe("[Customization] Delete Storages");
		});
	});
});
