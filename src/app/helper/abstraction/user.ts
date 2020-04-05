import { LoadingPoint } from "./loading-points";
import { Storage } from "./storages";

export interface UserProfileDto {
	login: string;
	lastName: string;
	firstName: string;
	middleName: string;
	jobPost: string;
	email: string;
	storage: LoadingPoint;
	phoneNumber: string;
	updateProfile: Date;
	lastAuthorization: Date;
	rememberLogin: boolean;
}

export interface UserProfile {
	login: string;
	lastName: string;
	firstName: string;
	middleName: string;
	jobPost: string;
	email: string;
	phoneNumber: string;
	updateProfile: Date;
	lastAuthorization: Date;
	rememberLogin: boolean;
	// storageId: number | null;
	storage: LoadingPoint;
}

export interface UserActivateParams {
	code: string;
	id: number;
	newPassword: string;
	newPasswordReplay: string;
}
