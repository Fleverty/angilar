import { createAction } from "@ngrx/store";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { UnitOfMeasuresParams, UnitOfMeasure } from "@helper/abstraction/unit-of-measures";
import { ProductExtraFieldsParams, ProductExtraField } from "@helper/abstraction/extra-fields";
import { HttpErrorResponse } from "@angular/common/http";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";
import { SignedDraftDto } from "@helper/abstraction/draft";

// -------------------ACTIONS WITH CHECKING SIGN IN Einvoice-------------------
export const checkSign = createAction(
	"[Einvoice] Check Sign",
	(payload: { documentId: string }): { params: { documentId: string } } => ({ params: payload })
);

export const checkSignSuccess = createAction(
	"[Einvoice] Check Sign Success",
	(payload: boolean): { statusOfCheckSign: boolean } => ({ statusOfCheckSign: payload })
);

export const checkSignError = createAction(
	"[Einvoice] Check Sign Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const resetEinvoice = createAction("[Einvoice] Reset Einvoice");

export const getEinvoiceDraftNumberSuccess = createAction(
	"[Einvoice] Get Einvoice Draft Number Success",
	(payload: string): { einvoiceDraftNumber: string } => ({ einvoiceDraftNumber: payload })
);

export const resetEinvoiceDraftNumber = createAction("[Einvoice] Reset Einvoice Draft Number");

// -------------------ACTIONS WITH UNIT OF MEASURES DICTIONARY-------------------
export const updateUnitOfMeasuresFilter = createAction(
	"[Einvoice] Next Unit Of Measures Filter",
	(payload: UnitOfMeasuresParams): { filter: UnitOfMeasuresParams } => ({ filter: payload })
);

export const resetUnitOfMeasures = createAction(
	"[Einvoice] Reset Unit Of Measures",
	(): { unitOfMeasures: undefined } => ({ unitOfMeasures: undefined })
);

export const getUnitOfMeasuresSuccess = createAction(
	"[Einvoice] Get Unit Of Measures Success",
	(payload: UnitOfMeasure[]): { unitOfMeasures: UnitOfMeasure[] } => ({ unitOfMeasures: payload })
);

export const getUnitOfMeasuresError = createAction(
	"[Einvoice] Get Unit Of Measures Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH COUNTRIES DICTIONARY-------------------
export const updateCountriesFilter = createAction(
	"[Einvoice] Next Countries Filter",
	(payload: CountriesParams): { filter: CountriesParams } => ({ filter: payload })
);

export const resetCountries = createAction(
	"[Einvoice] Reset Countries",
	(): { countries: undefined } => ({ countries: undefined })
);

export const getCountriesSuccess = createAction(
	"[Einvoice] Get Countries Success",
	(payload: Country[]): { countries: Country[] } => ({ countries: payload })
);

export const getCountriesError = createAction(
	"[Einvoice] Get Countries Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH EXTRA FIELD OF PRODUCT DICTIONARY-------------------
export const updateProductExtraFieldsFilter = createAction(
	"[Einvoice] Next Product Extra Fields Filter",
	(payload: ProductExtraFieldsParams): { filter: ProductExtraFieldsParams } => ({ filter: payload })
);

export const resetProductExtraFields = createAction(
	"[Einvoice] Reset Product Extra Fields",
	(): { productExtraFields: undefined } => ({ productExtraFields: undefined })
);

export const getProductExtraFieldsSuccess = createAction(
	"[Einvoice] Get Product Extra Fields Success",
	(payload: ProductExtraField[]): { productExtraFields: ProductExtraField[] } => ({ productExtraFields: payload })
);

export const getProductExtraFieldsError = createAction(
	"[Einvoice] Get Product Extra Fields Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------Provider Confirmation-------------------
export const getProviderConfirmation = createAction(
	"[Einvoice] Get Provider Confirmation",
	(payload: string): { id: string } => ({ id: payload })
);

export const getProviderConfirmationSuccess = createAction(
	"[Einvoice] Get Provider Confirmation  Success",
	(payload: ProviderConfirmation): { providerConfirmation: ProviderConfirmation } => ({ providerConfirmation: payload })
);

export const getProviderConfirmationError = createAction(
	"[Einvoice] Get Provider Confirmation Error",
	(payload: HttpErrorResponse): { errors: HttpErrorResponse } => ({ errors: payload })
);


// -------------------page: edit-popup, button: edit then signd and send-------------------
export const creatEditedEinvoice = createAction(
	"[Einvoice] Create Einvoice",
	(payload: { id: number; changeReason: string }): { id: number; changeReason: string } => ({ ...payload })
);

export const creatEditedEinvoiceSuccess = createAction(
	"[Einvoice] Create Einvoice Success",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const creatEditedEinvoiceError = createAction(
	"[Einvoice] Create Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const saveSignedBlrapnEinvoice = createAction(
	"[Einvoice] Save Signed Blrapn Einvoice",
	(signedDraft: SignedDraftDto, id: string): { signedDraft: SignedDraftDto; id: string } => ({ signedDraft, id })
);

export const saveSignedBlrapnEinvoiceSuccess = createAction("[Einvoice] Save Signed Blrapn Einvoice Success");

export const saveSignedBlrapnEinvoiceError = createAction(
	"[Einvoice] Save Signed Blrapn Einvoice Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);
