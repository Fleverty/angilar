import { FilterRequestParams } from "./filter";

export interface LoadingPoint {
	id: number;
	gln: string;
	storageName: string;
	addressFull: string;
}

export interface LoadingPointsParams extends FilterRequestParams { }

export type LoadingPointsDto = LoadingPoint[];
