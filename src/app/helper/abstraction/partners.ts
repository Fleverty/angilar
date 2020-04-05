import { DocumentType } from "@helper/abstraction/documents";
import { FilterRequestParams } from "./filter";

export interface PartnersParams extends FilterRequestParams {
	documentTypeId?: DocumentType;
}

export type PartnersDto = Partner[];

export interface Partner {
	id: string;
	name: string;
	gln: string;
	unp: string;
	addressFull: string;
}
