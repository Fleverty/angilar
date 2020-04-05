import { FilterRequestParams } from "./filter";

export interface ExtraField {
	fieldCode: string;
	fieldName: string;
	fieldValue: string;
}

export type ExtraFieldsParams = FilterRequestParams;

export type ExtraFieldsDto = ExtraField[];

export interface ProductExtraField {
	id: number;
	fieldCode: string;
	fieldName: string;
}

export interface ProductExtraFieldsParams extends FilterRequestParams { }

export type ProductExtraFieldDto = ProductExtraField[];
