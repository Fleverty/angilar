import { FilterRequestParams } from "./filter";

export interface GeneralGLN {
	id: number;
	gln: string;
	address: string;
}

export type GeneralGLNsParams = FilterRequestParams;

export type GeneralGLNsDto = GeneralGLN[];
