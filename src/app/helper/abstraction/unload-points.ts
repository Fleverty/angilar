import { FilterRequestParams } from "./filter";
import { DocumentType } from "./documents";

export interface UnloadingPoint {
	id: number;
	gln: string;
	storageName: string;
	addressFull: string;
}

export interface UnloadingPointsParams extends FilterRequestParams {
	consigneeId?: number;
	documentTypeId: DocumentType;
}

export type UnloadingPointsDto = UnloadingPoint[];

