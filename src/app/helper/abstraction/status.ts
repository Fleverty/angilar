import { DocumentType } from "./documents";

export interface StatusesParams {
	documentTypeId: DocumentType;
}

export type StatusesDto = Status[];

export interface Status {
	id: string;
	name: string;
}
