import { FilterRequestParams } from "./filter";

export type CertificatesDto = Certificate[];

export type CertificateParams = FilterRequestParams;

export interface Certificate {
	id: number;
	code: string;
	nameFull: string;
}
