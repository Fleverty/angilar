import { createAction } from "@ngrx/store";
import { Storage, StoragesParams, StorageCreate } from "@helper/abstraction/storages";
import { SectionList, HelpContent, ChangeUserPassword } from "@helper/abstraction/sections";
import { Organization } from "@helper/abstraction/organization";
import { UserProfile } from "@helper/abstraction/user";
import { Partner, PartnersParams } from "@helper/abstraction/partners";
import { CountriesParams, Country } from "@helper/abstraction/countries";
import { RegionsParams, Region } from "@helper/abstraction/regions";
import { StreetsParams, Street } from "@helper/abstraction/streets";
import { HttpErrorResponse } from "@angular/common/http";

export const getHelpLists = createAction("[Customization] Get Help Lists");
export const getHelpListsError = createAction(
	"[Customization] Get Help Lists Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const getHelpListsSuccess = createAction(
	"[Customization] Get Help Lists Success",
	(payload: SectionList[]): { sectionList: SectionList[] } => ({ sectionList: payload })
);

export const getActiveHelpContent = createAction(
	"[Customization] Get Help Page Content",
	(payload: number): { id: number } => ({ id: payload })
);
export const getActiveHelpContentError = createAction(
	"[Customization] Get Help Page Content Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const getActiveHelpContentSuccess = createAction(
	"[Customization] Get Help Page Content Success",
	(payload: HelpContent): { activeHelpContent: HelpContent } => ({ activeHelpContent: payload })
);
export const getStorages = createAction(
	"[Customization] Get Storages",
	(payload: StoragesParams): { storagesParams: StoragesParams } => ({ storagesParams: payload })
);
export const getStoragesSuccess = createAction(
	"[Customization] Get Storages Success",
	(payload: Storage[]): { storages: Storage[] } => ({ storages: payload })
);
export const getStoragesError = createAction(
	"[Customization] Get Storages Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const setStoragesLoaded = createAction(
	"[Customization] Set Storages Loaded",
	(payload: boolean): { storagesLoaded: boolean } => ({ storagesLoaded: payload })
);
export const resetStorages = createAction(
	"[Documents] Reset Storages"
);
export const deleteStorages = createAction(
	"[Customization] Delete Storages",
	(payload: Storage[]): { storages: Storage[] } => ({ storages: payload })
);
export const deleteStorageSuccess = createAction(
	"[Customization] Delete Storage Success",
	(payload: number[]): { storages: number[] } => ({ storages: payload })
);
export const deleteStorageFailed = createAction(
	"[Customization] Delete Storage Failed",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const needConfirmationGLN = createAction(
	"[Customization] Delete Storage Question",
	(payload: string[]): { glns: string[] } => ({ glns: payload })
);
export const confirmDeletingStorages = createAction(
	"[Customization] Confirm Deleting Storages",
	(payload: Storage[]): { storages: Storage[] } => ({ storages: payload })
);
export const unConfirmDeletingStorages = createAction(
	"[Customization] UnConfirm Deleting Storages"
);

export const openPopupChangePassword = createAction("[Customization] Open Popup Change Password Success");
export const changePassword = createAction(
	"[Customization] Change Password",
	(payload: ChangeUserPassword): { form: ChangeUserPassword } => ({ form: payload })
);
export const changePasswordError = createAction(
	"[Customization] Change Password Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const changePasswordSuccess = createAction(
	"[Customization] Change Password Success"
);
export const passwordError = createAction(
	"[Customization] Get Help Change Password Content Error",
	(payload: Record<string, string[]>): { passwordErrors: Record<string, string[]> } => ({ passwordErrors: payload })
);

export const recordOrganization = createAction(
	"[Customization] Record Organization",
	(payload: Organization): { organizationInfo: Organization } => ({ organizationInfo: payload })
);
export const changeOrganization = createAction(
	"[Customization] Get Change Organization",
	(payload: Organization): { organizationInfo: Organization } => ({ organizationInfo: payload })
);
export const saveOrganization = createAction("[Customization] Get Save Organization");
export const saveOrganizationError = createAction(
	"[Customization] Get Save Organization Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const saveOrganizationSuccess = createAction("[Customization] Get Save Organization Success");
export const cancelSaveOrganization = createAction("[Customization] Get Cancel Save Organization");

export const recordProfile = createAction(
	"[Customization] Record Profile",
	(payload: UserProfile): { userProfile: UserProfile } => ({ userProfile: payload })
);
export const changeProfile = createAction(
	"[Customization] Get Change Profile",
	(payload: UserProfile): { userProfile: UserProfile } => ({ userProfile: payload })
);
export const saveProfile = createAction("[Customization] Get Save Profile");
export const saveProfileError = createAction(
	"[Customization] Get Save Profile Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const saveProfileSuccess = createAction("[Customization] Get Save Profile Success");
export const cancelSaveProfile = createAction("[Customization] Get Cancel Save Profile");

export const updateStoragesListFilter = createAction(
	"[Customization] Update Storages List Filter",
	(payload: StoragesParams): { filter: StoragesParams } => ({ filter: payload })
);
export const updateStoragesListSuccess = createAction(
	"[Customization] Update Storages List Success",
	(payload: Storage[]): { storagesList: Storage[] } => ({ storagesList: payload })
);
export const updateStoragesListError = createAction(
	"[Customization] Update Storages List Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const resetStoragesList = createAction(
	"[Customization] Reset Storages Lists",
	(): { storagesList: undefined } => ({ storagesList: undefined })
);

export const resetPartners = createAction("[Customization] Reset Partners");
export const getPartners = createAction("[Customization] Get Partners",
	(payload: PartnersParams): { partnersParams: PartnersParams } => ({ partnersParams: payload })
);
export const getPartnersSuccess = createAction(
	"[Customization] Get Partners Success",
	(payload: Partner[]): { partners: Partner[] } => ({ partners: payload })
);
export const getPartnersError = createAction(
	"[Customization] Get Partners Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const resetLoadingPoints = createAction("[Customization] Reset Loading Points");

// -------------------ACTIONS WITH COUNTRIES DICTIONARY-------------------
export const updateCountriesFilter = createAction(
	"[Customization] Next Countries Filter",
	(payload: CountriesParams): { filter: CountriesParams } => ({ filter: payload })
);

export const resetCountries = createAction(
	"[Customization] Reset Countries",
	(): { countries: undefined } => ({ countries: undefined })
);

export const getCountriesSuccess = createAction(
	"[Customization] Get Countries Success",
	(payload: Country[]): { countries: Country[] } => ({ countries: payload })
);

export const getCountriesError = createAction(
	"[Customization] Get Countries Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH REGION DICTIONARY-------------------
export const updateRegionsFilter = createAction(
	"[Customization] Next Regions Filter",
	(payload: RegionsParams): { filter: RegionsParams } => ({ filter: payload })
);

export const resetRegions = createAction(
	"[Customization] Reset Regions",
	(): { regions: undefined } => ({ regions: undefined })
);

export const getRegionsSuccess = createAction(
	"[Customization] Get Regions Success",
	(payload: Region[]): { regions: Region[] } => ({ regions: payload })
);

export const getRegionsError = createAction(
	"[Customization] Get Regions Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------ACTIONS WITH REGION DICTIONARY-------------------
export const updateStreetsFilter = createAction(
	"[Customization] Next Streets Filter",
	(payload: StreetsParams): { filter: StreetsParams } => ({ filter: payload })
);

export const resetStreets = createAction(
	"[Customization] Reset Streets",
	(): { streets: undefined } => ({ streets: undefined })
);

export const getStreetsSuccess = createAction(
	"[Customization] Get Streets Success",
	(payload: Street[]): { streets: Street[] } => ({ streets: payload })
);

export const getStreetsError = createAction(
	"[Customization] Get Streets Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const openPopupSaveStorage = createAction("[Customization] Open Popup Save Storage");
export const saveStorage = createAction(
	"[Customization] Get Save Storage",
	(payload: StorageCreate): { storage: StorageCreate } => ({ storage: payload })
);
export const otherStorageError = createAction(
	"[Customization] Get Other Storage Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const storageError = createAction(
	"[Customization] Get Storage Error",
	(payload: HttpErrorResponse): { storageErrors: HttpErrorResponse } => ({ storageErrors: payload })
);
export const saveStorageSuccess = createAction("[Customization] Get Save Storage Success");

export const setActiveHelpId = createAction(
	"[Customization] Set Active Help Id",
	(payload: string): { activeHelpId: string } => ({ activeHelpId: payload })
);

export const resetActiveHelpId = createAction(
	"[Customization] Reset Active Help Id",
	(): { activeHelpId: undefined } => ({ activeHelpId: undefined })
);

export const setOrganizationFormValidation = createAction(
	"[Customization] Set Organization Form Validation",
	(payload: boolean): { isValid: boolean } => ({ isValid: payload })
);
