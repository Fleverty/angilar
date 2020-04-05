import { FilterRequestParams } from "./filter";

export interface CountriesParams extends FilterRequestParams { }

export type CountryDto = Country[];

export interface Country {
	id: number;
	name: string;
}
