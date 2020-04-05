import { FilterRequestParams } from "./filter";

export interface StreetsParams extends FilterRequestParams { }

export type StreetDto = Street[];

export interface Street {
	id: number;
	name: string;
}
