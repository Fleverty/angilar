import { Role } from "@helper/abstraction/roles";
import { Action, createReducer, on } from "@ngrx/store";
import * as UserActions from "./user.actions";
import { UserProfile } from "@helper/abstraction/user";
import { Organization } from "@helper/abstraction/organization";
import { NewInboxDocuments } from "@helper/abstraction/documents";

export interface UserState {
	token?: string;
	roles: Role[];
	userProfile?: UserProfile;
	organizationInfo?: Organization;
	newInboxDocumentsCount: NewInboxDocuments;
	isPasswordRestore?: boolean;
}

const initialState: UserState = {
	roles: [],
	newInboxDocumentsCount: {}
};

const userReducer = createReducer(
	initialState,
	on(UserActions.setToken, (state, { token }): UserState => ({ ...state, token })),
	on(UserActions.setRoles, (state, { roles }): UserState => ({ ...state, roles })),
	on(UserActions.getRolesError, (state): UserState => ({ ...state })),
	on(UserActions.getProfileSuccess, (state, { userProfile }): UserState => ({ ...state, userProfile })),
	on(UserActions.getOrganizationSuccess, (state, { organizationInfo }): UserState => ({ ...state, organizationInfo })),
	on(UserActions.setNewInboxDocumentsCount, (state, { newInboxDocumentsCount }): UserState => ({ ...state, newInboxDocumentsCount })),
	on(UserActions.restoreUserPasswordSuccess, (state): UserState => ({ ...state, isPasswordRestore: true })),
	on(UserActions.restoreUserPasswordError, (state): UserState => ({ ...state, isPasswordRestore: false }))
);

export function reducer(state: UserState | undefined, action: Action): UserState {
	return userReducer(state, action);
}
