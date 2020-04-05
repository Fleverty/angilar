import { Role } from "@helper/abstraction/roles";
import { createAction } from "@ngrx/store";
import { UserProfile } from "@helper/abstraction/user";
import { Organization } from "@helper/abstraction/organization";
import { NewInboxDocuments, DocumentType } from "@helper/abstraction/documents";
import { HttpErrorResponse } from "@angular/common/http";
import { DraftType } from "@helper/abstraction/draft";
import { StatisticOrderParams, StatisticEwaybillParams } from "@helper/abstraction/statistic";
export const setToken = createAction(
	"[User] Set Token",
	(payload?: string): { token?: string } => ({ token: payload })
);

export const setRoles = createAction(
	"[User] Set roles",
	(payload: Role[]): { roles: Role[] } => ({ roles: payload })
);

export const getRoles = createAction("[User] Get roles");

export const getRolesSuccess = createAction(
	"[User] Get roles success",
	(payload: Role[]): { roles: Role[] } => ({ roles: payload })
);

export const getRolesError = createAction(
	"[User] Get roles error",
	(payload: Error): { error: Error } => ({ error: payload })
);

export const getProfile = createAction("[User] Get Profile");
export const getProfileError = createAction(
	"[User] Get Profile Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const getProfileSuccess = createAction(
	"[User] Get Profile Success",
	(payload: UserProfile): { userProfile: UserProfile } => ({ userProfile: payload })
);

export const getOrganization = createAction("[User] Get Organization");
export const getOrganizationError = createAction(
	"[User] Get Organization Error",
	(payload: Error): { error: Error } => ({ error: payload })
);
export const getOrganizationSuccess = createAction(
	"[User] Get Organization Success",
	(payload: Organization): { organizationInfo: Organization } => ({ organizationInfo: payload })
);

export const getNewInboxDocumentsCount = createAction(
	"[User] Get New Inbox Documents Count"
);

export const setNewInboxDocumentsCount = createAction(
	"[User] Set New Inbox Documents Count",
	(payload: NewInboxDocuments): { newInboxDocumentsCount: NewInboxDocuments } => ({ newInboxDocumentsCount: payload })
);

export const getNewInboxDocumentsCountError = createAction(
	"[User] Get New Inbox Documents Count Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);

export const restoreUserPassword = createAction(
	"[User] Restore User Password",
	(payload: { email: string }): { email: string } => ({ email: payload.email })
);

export const restoreUserPasswordSuccess = createAction(
	"[User] Restore User Password Success"
);

export const restoreUserPasswordError = createAction(
	"[User] Restore User Password Error",
	(payload: HttpErrorResponse): { error: HttpErrorResponse } => ({ error: payload })
);


// -------------------ACTIONS WITH EXPORT XML DOCUMENTS-------------------
export const exportXMLDocuments = createAction(
	"[User] Export XML Documents",
	(payload: { documentType: DraftType; documentIds: number[] }): { params: { documentType: DraftType; documentIds: number[] } } => ({ params: payload })
);

export const exportXMLDocumentsSuccess = createAction(
	"[User] Export XML Documents Success",
	(payload: { data: Blob; name: string; extension: string }): { file: { data: Blob; name: string; extension: string } } => ({ file: payload })
);

export const exportXMLDocumentsError = createAction(
	"[User] Export XML Documents Error",
	(payload: HttpErrorResponse | Error): { error: HttpErrorResponse | Error } => ({ error: payload })
);

// -------------------ACTIONS WITH EXPORT XLSX DOCUMENTS-------------------
export const exportXLSXDocuments = createAction(
	"[User] Export XLSX Documents",
	(payload: { documentType: DocumentType; documentIds: number[] }): { params: { documentType: DocumentType; documentIds: number[] } } => ({ params: payload })
);

export const exportXLSXDocumentsSuccess = createAction(
	"[User] Export XLSX Documents Success",
	(payload: { data: Blob; name: string; extension: string }): { file: { data: Blob; name: string; extension: string } } => ({ file: payload })
);

export const exportXLSXDocumentsError = createAction(
	"[User] Export XLSX Documents Error",
	(payload: HttpErrorResponse | Error): { error: HttpErrorResponse | Error } => ({ error: payload })
);

// -------------------ACTIONS WITH CREATE REGISTRY-------------------
export const createRegistry = createAction(
	"[Documents] Create Registry",
	(payload: string): { id: string } => ({ id: payload })
);

export const createRegistrySuccess = createAction(
	"[Documents] Create Registry Success",
	(payload: { data: Blob; name: string; extension: string }): { file: { data: Blob; name: string; extension: string } } => ({ file: payload })
);

export const createRegistryError = createAction(
	"[Documents] Create Registry Error",
	(payload: Error): { error: Error } => ({ error: payload })
);

// -------------------------- ACTIONS WITH STATISTICS XLSX --------------------------
export const getStatisticsOrdersXLSX = createAction(
	"[Statistic] Get Statistics Orders XLSX",
	(payload: StatisticOrderParams): { statisticFilterParams: StatisticOrderParams } => ({ statisticFilterParams: payload })
);

export const getStatisticsEwaybillXLSX = createAction(
	"[Statistic] Get Statistics Ewaybill XLSX",
	(payload: StatisticEwaybillParams): { statisticFilterParams: StatisticEwaybillParams } => ({ statisticFilterParams: payload })
);

export const getStatisticsXLSXError = createAction(
	"[Statistic] Get Statistics XLSX Error",
	(payload: Error): { statisticError: Error } => ({ statisticError: payload })
);

export const getStatisticsXLSXSuccess = createAction(
	"[Statistic] Get Statistics XLSX Success",
	(payload: { data: Blob; name: string; extension: string }): { file: { data: Blob; name: string; extension: string } } => ({ file: payload })
);
