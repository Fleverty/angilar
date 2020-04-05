import { FilterRequestParams } from "./filter";

export interface Currency {
	id: number;
	code: string;
	name: string;
}

export type CurrenciesFilter = CurrenciesParams & { isLoaded: boolean };

export interface CurrenciesParams extends FilterRequestParams { }

export type CurrenciesDto = Currency[];
