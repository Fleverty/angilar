import { FilterRequestParams } from "./filter";
import { DocumentType } from "./documents";

export type StoragesParams = FilterRequestParams;
export interface TypedStoragesParams extends StoragesParams {
	partnerId?: number;
	documentTypeId: DocumentType;
	storageTypeId: "LOADING_PLACE" | "UNLOADING_PLACE" | "DELIVERY_PLACE";
}

export type StoragesDto = Storage[];

export interface Storage {
	id: number;
	storageName: string;
	addressFull: string;
	gln: string;
	removalRequest: boolean;
	state: boolean;
	verified: boolean;
}

export interface StorageCreateDto {
	address: string; //Адрес (название улицы), в котором находится склад
	addressNumHouse: string; //№ дома, в котором находится склад
	addressNumHousing: string; //№ корпуса, в котором находится склад
	addressNumOffice: string; //№ офиса, в котором находится склад
	addressStreetTypeId: number; //Адрес (тип улицы), в котором находится склад. nsi_street_type
	city: string; //Населенный пункт, в котором находится склад
	countryId: number; //Страна склада. Идентификатор страны из api nsi получения стран
	gln: string; //GLN склада
	id: number;
	postalCode: string; //Почтовый индекс склада
	regionId: number; //Регион, в котором находится склад. Идентификатор страны из api nsi получения регионов
	storageCodeInErp: string; //Код склада в своей ERP системе
	storageName: string; //Наименование склада
}

export type StorageCreate = StorageCreateDto;
