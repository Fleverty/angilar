import { FilterRequestParams } from "./filter";

export interface UnitOfMeasuresParams extends FilterRequestParams { }

export type UnitOfMeasureDto = UnitOfMeasure[];

export interface UnitOfMeasure {
	id: number;
	name: string;
	alpha3: string;
}
