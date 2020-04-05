import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule, Store } from "@ngrx/store";
import { of } from "rxjs";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EwaybillAttachedDocumentsComponent } from "../ewaybill-attached-documents/ewaybill-attached-documents.component";
import { EwaybillExtraInformationComponent } from "../ewaybill-extra-information/ewaybill-extra-information.component";
import { EwaybillOtherDetailsComponent } from "../ewaybill-other-details/ewaybill-other-details.component";
import { EwaybillPlacesShipmentDeliveryComponent } from "../ewaybill-places-shipment-delivery/ewaybill-places-shipment-delivery.component";
import { EwaybillProductsListComponent } from "../ewaybill-products-list/ewaybill-products-list.component";
import { EwaybillEditTotalSumsComponent } from "../ewaybill-edit-total-sums/ewaybill-edit-total-sums.component";
import { OverlayService } from "@core/overlay.service";
import { ActivatedRoute, Router } from "@angular/router";
import { EwaybillComponent } from "./ewaybill.component";
import { EwaybillProductPopupComponent } from "../ewaybill-product-popup/ewaybill-product-popup.component";
import { EwaybillCommonInformationComponent } from "@app/user/documents/ewaybill/ewaybill-common-information/ewaybill-common-information.component";
import { EwaybillShipperInformationComponent } from "@app/user/documents/ewaybill/ewaybill-shipper-information/ewaybill-shipper-information.component";
import { EwaybillReceiverInformationComponent } from "@app/user/documents/ewaybill/ewaybill-receiver-information/ewaybill-receiver-information.component";
import { EwaybillFreightPayerInformationComponent } from "@app/user/documents/ewaybill/ewaybill-freight-payer-information/ewaybill-freight-payer-information.component";

describe("EwaybillComponent", () => {
	let component: EwaybillComponent;
	let fixture: ComponentFixture<EwaybillComponent>;
	const formBuilder: FormBuilder = new FormBuilder();

	const storeMock = {
		currencies$: of([
			[{ id: 16, code: "AFN", name: "Афгани" }, "AFN"],
			[{ id: 17, code: "ALL", name: "Лек" }, "ALL"]
		]),
		pipe: (): any => {
			return of([]);
		},
		dispatch: (e: any): any => {
			return e;
		},
		takeUntil(): any {
			return of([]);
		}
	};

	const popupServiceStub = {
		open: (): void => { }
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				RouterTestingModule,
				ReactiveFormsModule,
				CommonModule,
				StoreModule.forRoot([], {
					runtimeChecks: {
						strictStateImmutability: true,
						strictActionImmutability: true,
						strictActionSerializability: false,
						strictStateSerializability: false,
					}
				})
			],
			providers: [
				{ provide: Store, useValue: storeMock },
				{ provide: APP_BASE_HREF, useValue: "/" },
				{ provide: OverlayService, useValue: popupServiceStub },
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot:
						{
							pathFromRoot: {
								7: {
									params: {
										documentTypeId: "EWAYBILL"
									}
								}
							},
							queryParams: {
								isTest: true,
								kind: "common",
								type: "EWAYBILL"
							},
						},
					}
				},
				{ provide: FormBuilder, useValue: formBuilder }
			],
			declarations: [
				EwaybillComponent,
				EwaybillProductPopupComponent,
				EwaybillCommonInformationComponent,
				EwaybillAttachedDocumentsComponent,
				EwaybillExtraInformationComponent,
				EwaybillOtherDetailsComponent,
				EwaybillPlacesShipmentDeliveryComponent,
				EwaybillProductsListComponent,
				EwaybillEditTotalSumsComponent,
				EwaybillShipperInformationComponent,
				EwaybillReceiverInformationComponent,
				EwaybillFreightPayerInformationComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(EwaybillComponent);
		component = fixture.componentInstance;
		component.currencies$ = of([]);
		fixture.whenStable();
		fixture.detectChanges();
	});

	it("Should create.", () => {
		expect(component).toBeTruthy();
	});

	describe("Test goBack()", () => {
		it("Should navigate by url /user/documents/EWAYBILL.",
			inject([Router], (router: Router) => {
				const spy = spyOn(router, "navigate");
				component.goBack();
				const navArgs = spy.calls.first().args[0].join("/");
				expect(`/${navArgs}`).toBe("/user/documents/EWAYBILL");
			})
		);
	});

	describe("Test save(form)", () => {
		it("Should not dispatch in store if form is not valid",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const form: FormGroup = formBuilder.group({
					invalidControl: ["", Validators.required]
				});
				component.save(form);
				expect(spy.calls.first()).toBeUndefined();
			})
		);
		it("Should dispatch [Ewaybill] Save Document in store if form is valid",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const form: FormGroup = formBuilder.group({
					validControl: ["text", Validators.required]
				});
				component.save(form);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Save Document");
			})
		);
	});

	// ---------------CONSIGNEE---------------
	describe("Test updateConsigneeFilter(consigneeName?)", () => {
		it("Should reset consigneeName if parameter is empty",
			(() => {
				component.updateConsigneeFilter();
				expect(component.consigneeFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.consigneeFilter.page;
				component.updateConsigneeFilter();
				expect(component.consigneeFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set consigneeName if parameter is not empty",
			(() => {
				const consigneeName = "string";
				component.updateConsigneeFilter(consigneeName);
				expect(component.consigneeFilter.searchText).toEqual(consigneeName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const consigneeName = "string";
				component.updateConsigneeFilter(consigneeName);
				expect(component.consigneeFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset Consignees in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const consigneeName = "string";
				component.updateConsigneeFilter(consigneeName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset Consignees");
			})
		);
		it("Should dispatch [Ewaybill] Next Consignee Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateConsigneeFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next Consignee Filter");
			})
		);
	});

	// ---------------CURRENCY---------------
	describe("Test updateCurrencyFilter(currencyName?)", () => {
		it("Should reset currencyName if parameter is empty",
			(() => {
				component.updateCurrencyFilter();
				expect(component.currenciesFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.currenciesFilter.page;
				component.updateCurrencyFilter();
				expect(component.currenciesFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set currencyName if parameter is not empty",
			(() => {
				const currencyName = "string";
				component.updateCurrencyFilter(currencyName);
				expect(component.currenciesFilter.searchText).toEqual(currencyName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const currencyName = "string";
				component.updateCurrencyFilter(currencyName);
				expect(component.currenciesFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset Currencies in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const currencyName = "string";
				component.updateCurrencyFilter(currencyName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset Currencies");
			})
		);
		it("Should dispatch [Ewaybill] Next Currency Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateCurrencyFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next Currency Filter");
			})
		);
	});

	// ---------------GENERAL GLN---------------
	describe("Test updateGeneralGLNsFilter(glnName?)", () => {
		it("Should reset glnName if parameter is empty",
			(() => {
				component.updateGeneralGLNsFilter();
				expect(component.glnFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.glnFilter.page;
				component.updateGeneralGLNsFilter();
				expect(component.glnFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set glnName if parameter is not empty",
			(() => {
				const glnName = "string";
				component.updateGeneralGLNsFilter(glnName);
				expect(component.glnFilter.searchText).toEqual(glnName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const glnName = "string";
				component.updateGeneralGLNsFilter(glnName);
				expect(component.glnFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset General GLNs in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const glnName = "string";
				component.updateGeneralGLNsFilter(glnName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset General GLNs");
			})
		);
		it("Should dispatch [Ewaybill] Next GeneralGLN Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateGeneralGLNsFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next GeneralGLN Filter");
			})
		);
	});

	// ---------------LOADING POINTS---------------
	describe("Test updateLoadingPointsFilter(storageName?)", () => {
		it("Should reset storageName if parameter is empty",
			(() => {
				component.updateLoadingPointsFilter();
				expect(component.loadingPointsFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.loadingPointsFilter.page;
				component.updateLoadingPointsFilter();
				expect(component.loadingPointsFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set storageName if parameter is not empty",
			(() => {
				const storageName = "string";
				component.updateLoadingPointsFilter(storageName);
				expect(component.loadingPointsFilter.searchText).toEqual(storageName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const storageName = "string";
				component.updateLoadingPointsFilter(storageName);
				expect(component.loadingPointsFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset Loading Points in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const storageName = "string";
				component.updateLoadingPointsFilter(storageName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset Loading Points");
			})
		);
		it("Should dispatch [Ewaybill] Next Loading Points Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateLoadingPointsFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next Loading Points Filter");
			})
		);
	});

	// ---------------UNLOADING POINTS---------------
	describe("Test updateUnloadingPointsFilter(storageName?)", () => {
		it("Should reset storageName if parameter is empty",
			(() => {
				component.updateUnloadingPointsFilter();
				expect(component.unloadPointsFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.unloadPointsFilter.page;
				component.updateUnloadingPointsFilter();
				expect(component.unloadPointsFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set storageName if parameter is not empty",
			(() => {
				const storageName = "string";
				component.updateUnloadingPointsFilter(storageName);
				expect(component.unloadPointsFilter.searchText).toEqual(storageName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const storageName = "string";
				component.updateUnloadingPointsFilter(storageName);
				expect(component.unloadPointsFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset Unloading Points in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const storageName = "string";
				component.updateUnloadingPointsFilter(storageName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset Unloading Points");
			})
		);
		it("Should dispatch [Ewaybill] Next Unloading Points Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateUnloadingPointsFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next Unloading Points Filter");
			})
		);
	});

	// ---------------EXTRA FIELDS---------------
	describe("Test updateExtraFieldsFilter(extraFieldName?)", () => {
		it("Should reset extraFieldName if parameter is empty",
			(() => {
				component.updateExtraFieldsFilter();
				expect(component.extraFieldsFilter.searchText).toBeUndefined();
			})
		);
		it("Should set next page if parameter is empty",
			(() => {
				const previousPage = component.extraFieldsFilter.page;
				component.updateExtraFieldsFilter();
				expect(component.extraFieldsFilter.page).toBeGreaterThan(previousPage);
			})
		);
		it("Should set extraFieldName if parameter is not empty",
			(() => {
				const extraFieldName = "string";
				component.updateExtraFieldsFilter(extraFieldName);
				expect(component.extraFieldsFilter.searchText).toEqual(extraFieldName);
			})
		);
		it("Should reset page if parameter is not empty",
			(() => {
				const extraFieldName = "string";
				component.updateExtraFieldsFilter(extraFieldName);
				expect(component.extraFieldsFilter.page).toEqual(1);
			})
		);
		it("Should dispatch [Ewaybill] Reset Extra Fields in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				const extraFieldName = "string";
				component.updateExtraFieldsFilter(extraFieldName);
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Reset Extra Fields");
			})
		);
		it("Should dispatch [Ewaybill] Next Extra Fields Filter in store",
			inject([Store], (store: Store<any>) => {
				const spy = spyOn(store, "dispatch");
				component.updateExtraFieldsFilter();
				const action: string = spy.calls.first().args[0].type;
				expect(action).toBe("[Ewaybill] Next Extra Fields Filter");
			})
		);
	});
});
