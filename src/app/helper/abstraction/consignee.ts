
import { FilterRequestParams } from "./filter";
import { DocumentType } from "./documents";

export interface Consignee {
	id: number
	gln: string
	name: string
	unp: string
	addressFull: string
}

export interface ConsigneesParams extends FilterRequestParams {
	documentTypeId: DocumentType;
}

export type ConsigneesDto = Consignee[];

