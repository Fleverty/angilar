import { SectionList, HelpContent } from "@helper/abstraction/sections";
import { Action, createReducer, on } from "@ngrx/store";

import * as CustomizationActions from "./customization.actions";
import { Storage } from "@helper/abstraction/storages";
import { Organization } from "@helper/abstraction/organization";
import { UserProfile } from "@helper/abstraction/user";
import { Partner } from "@helper/abstraction/partners";
import { Country } from "@helper/abstraction/countries";
import { Region } from "@helper/abstraction/regions";
import { Street } from "@helper/abstraction/streets";
import { HttpErrorResponse } from "@angular/common/http";

export interface CustomizationState {
	sectionList: SectionList[];
	activeHelpContent?: HelpContent;
	storages: Storage[];
	needConfirmGLN?: string[];
	organizationInfo?: Organization;
	isChangeOrganizationInfo?: boolean;
	passwordErrors?: Record<string, string[]>;
	isChangePassword?: boolean;
	userProfile?: UserProfile;
	isChangeUserProfile?: boolean;
	storagesList?: Storage[];
	storagesLoaded?: boolean;
	partners: Partner[];
	countries?: Country[];
	regions?: Region[];
	streets?: Street[];
	storageErrors?: HttpErrorResponse;
	otherStorageError?: Error;
	isChangeStorage?: boolean;
	activeHelpId?: string;
	saveError?: Error;
	isOrganizationFormValid: boolean;
}

const initialState: CustomizationState = {
	sectionList: [],
	partners: [],
	storages: [],
	isOrganizationFormValid: true
};

const customizationReducer = createReducer(
	initialState,
	on(CustomizationActions.getHelpListsSuccess, (state, { sectionList }): CustomizationState => ({ ...state, sectionList })),
	on(CustomizationActions.getActiveHelpContentSuccess, (state, { activeHelpContent }): CustomizationState => ({ ...state, activeHelpContent })),

	on(CustomizationActions.resetStorages, (state): CustomizationState => ({ ...state, storages: [], storagesLoaded: undefined })),
	on(CustomizationActions.getStoragesSuccess, (state, { storages }): CustomizationState => ({
		...state,
		storages: state.storages.concat(storages),
		storagesLoaded: false
	})),
	on(CustomizationActions.setStoragesLoaded, (state, { storagesLoaded }): CustomizationState => ({ ...state, storagesLoaded: storagesLoaded })),
	on(CustomizationActions.needConfirmationGLN, (state, { glns }): CustomizationState => ({ ...state, needConfirmGLN: glns })),
	on(CustomizationActions.unConfirmDeletingStorages, (state): CustomizationState => ({ ...state, needConfirmGLN: undefined })),
	on(CustomizationActions.deleteStorageSuccess, (state, { storages }): CustomizationState => ({
		...state,
		storages: state.storages.map((s: Storage) => {
			if (storages.indexOf(s.id) !== -1)
				return { ...s, removalRequest: true };
			return s;
		}),
		needConfirmGLN: undefined
	})),

	on(CustomizationActions.recordOrganization, (state, { organizationInfo }): CustomizationState => ({ ...state, organizationInfo, isChangeUserProfile: false })),
	on(CustomizationActions.changeOrganization, (state, { organizationInfo }): CustomizationState => ({ ...state, organizationInfo, isChangeOrganizationInfo: true })),
	on(CustomizationActions.saveOrganizationSuccess, (state): CustomizationState => ({ ...state, isChangeOrganizationInfo: false })),
	on(CustomizationActions.cancelSaveOrganization, (state): CustomizationState => ({ ...state, organizationInfo: undefined, isChangeOrganizationInfo: false })),

	on(CustomizationActions.changePassword, (state): CustomizationState => ({ ...state, passwordErrors: undefined, isChangePassword: false })),
	on(CustomizationActions.changePasswordSuccess, (state): CustomizationState => ({ ...state, passwordErrors: undefined, isChangePassword: true })),
	on(CustomizationActions.passwordError, (state, { passwordErrors }): CustomizationState => ({ ...state, passwordErrors, isChangePassword: false })),
	on(CustomizationActions.openPopupChangePassword, (state): CustomizationState => ({ ...state, passwordErrors: undefined, isChangePassword: undefined })),

	on(CustomizationActions.recordProfile, (state, { userProfile }): CustomizationState => ({ ...state, userProfile, isChangeUserProfile: false })),
	on(CustomizationActions.changeProfile, (state, { userProfile }): CustomizationState => ({ ...state, userProfile, isChangeUserProfile: true })),
	on(CustomizationActions.saveProfileSuccess, (state): CustomizationState => ({ ...state, isChangeUserProfile: false })),
	on(CustomizationActions.saveProfileError, (state, { error }): CustomizationState => ({ ...state, saveError: error, isChangeUserProfile: true })),
	on(CustomizationActions.cancelSaveProfile, (state): CustomizationState => ({ ...state, userProfile: undefined, isChangeUserProfile: false })),
	on(CustomizationActions.updateStoragesListSuccess, (state, { storagesList }): CustomizationState => ({ ...state, storagesList })),
	on(CustomizationActions.resetStoragesList, (state, { storagesList }): CustomizationState => ({ ...state, storagesList })),

	on(CustomizationActions.resetPartners, (state): CustomizationState => ({ ...state, partners: [] })),
	on(CustomizationActions.getPartnersSuccess, (state, { partners }): CustomizationState => ({ ...state, partners })),

	on(CustomizationActions.getCountriesSuccess, (state, { countries }): CustomizationState => ({ ...state, countries })),
	on(CustomizationActions.resetCountries, (state): CustomizationState => ({ ...state, countries: undefined })),

	on(CustomizationActions.getRegionsSuccess, (state, { regions }): CustomizationState => ({ ...state, regions })),
	on(CustomizationActions.resetRegions, (state): CustomizationState => ({ ...state, regions: undefined })),

	on(CustomizationActions.getStreetsSuccess, (state, { streets }): CustomizationState => ({ ...state, streets })),
	on(CustomizationActions.resetStreets, (state): CustomizationState => ({ ...state, streets: undefined })),

	on(CustomizationActions.saveStorage, (state): CustomizationState => ({ ...state, storageErrors: undefined, isChangeStorage: false })),
	on(CustomizationActions.saveStorageSuccess, (state): CustomizationState => ({ ...state, storageErrors: undefined, isChangeStorage: true })),
	on(CustomizationActions.storageError, (state, { storageErrors }): CustomizationState => ({ ...state, storageErrors, isChangeStorage: false })),
	on(CustomizationActions.otherStorageError, (state, { error }): CustomizationState => ({ ...state, otherStorageError: error, isChangeStorage: false })),
	on(CustomizationActions.openPopupSaveStorage, (state): CustomizationState => ({ ...state, storageErrors: undefined, isChangeStorage: undefined })),
	on(CustomizationActions.setActiveHelpId, (state, { activeHelpId }): CustomizationState => ({ ...state, activeHelpId })),
	on(CustomizationActions.resetActiveHelpId, (state, { activeHelpId }): CustomizationState => ({ ...state, activeHelpId })),
	on(CustomizationActions.setOrganizationFormValidation, (state, { isValid }): CustomizationState => ({ ...state, isOrganizationFormValid: isValid }))
);

export function reducer(state: CustomizationState | undefined, action: Action): CustomizationState {
	return customizationReducer(state, action);
}
