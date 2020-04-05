import { FilterRequestParams } from "./filter";

export interface RegionsParams extends FilterRequestParams { }

export type RegionDto = Region[];

export interface Region {
	id: number;
	name: string;
}
