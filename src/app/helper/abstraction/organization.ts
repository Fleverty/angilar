export interface OrganizationDto {
	accountNumber: string; //Расчетный счет
	addressFull: string; //Адрес
	bankAddress: string; //Адрес банка
	bankCode: string; //Код банка
	bankName: string; //Наименование банка
	contactEmail: string; //Email
	contactFirstName: string; //Имя
	contactJobPost: string; //Должность
	contactLastName: string; //Фамилия
	contactMiddleName: string; //Отчество
	contactPhone: string; //Контактный телефон
	dateUpdate: Date; //Дата обновления данных 
	description: string; //Описание
	directorBase: string; //На основании чего действует
	directorFullName: string; //Руководитель (ФИО)
	gln: string; //GLN (или LLN) организации
	groupPartyName: string; //Группа компаний
	id: number; //Идентификатор организации
	legalName: string; //Юридическое наименование
	nsiMnsName: string; //Инспекция МНС
	name: string; //Наименование
	partyCodeInErp: string; //Код в своей УС
	structureBelonging: string; //Структурная принадлежность
	unp: string; //УНП
	ewaybillProviderCode: string;
}

export type Organization = OrganizationDto;
