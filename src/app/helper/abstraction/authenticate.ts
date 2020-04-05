import { Role } from './roles';

export interface AuthenticateResponce {
	userRoles: Role[];
	uuid: string;
	statusCode: string;
	statusCodeValue: number;
}
