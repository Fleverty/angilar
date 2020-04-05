import { Currency } from "./currency";
import { EwaybillAttachedDocumentsForm } from "@app/user/documents/ewaybill/ewaybill-attached-documents/ewaybill-attached-documents.component";
import { ExtraFieldForm } from "@app/user/documents/ewaybill/ewaybill-extra-information/ewaybill-extra-information.component";
import { Country } from "./countries";
import { UnitOfMeasure } from "./unit-of-measures";
import { MessageType } from "./documents";
import { DocumentSignature } from "./signature";
import { Status } from "./status";

export interface EwaybillResponse extends Ewaybill {
	msgEwaybill: Ewaybill;
}

export interface Ewaybill extends Partial<DocumentSignature> {
	changeRequestList?: ChangeRequestEwaybillDocument[];
	changeRequestDocument?: ChangeRequestEwaybillDocument;
	certificate?: string;
	confirmation?: any;
	certificateUserName?: string;
	signatureDate?: Date;
	signatureTime?: string;
	cancelDocument?: DocumentSignature & { confirmation?: DocumentSignature };
	responseDocument?: DocumentSignature;
	testIndicator: boolean; // Тестовая
	processingStatus?: string; // Статус
	deliveryNoteNumber: string; // Серия // Номер
	deliveryNoteDate?: Date; // Дата создания(дата)
	ordersNumber?: string; // Номер заказа
	contractNumber?: string; // Основание отпуска номер
	contractDate?: Date; // Основание отпуска дата
	contractName?: string; // Основание отпуска наименование
	currency?: Currency; // Валюта
	number?: string; // Номер черновика

	// Грузоотправитель
	shipperGln?: string; // Грузоотправитель GLN
	shipperId?: number; // Грузоотправитель ID
	shipperName?: string; // Грузоотправитель наименование
	shipperAddress?: string; // Грузоотправитель адрес
	shipperUnp?: string; // Грузоотправитель УНП
	shipperProviderId?: string;

	// Грузополучатель 
	receiverGln?: string; // Грузополучатель GLN
	receiverId?: number; // Грузополучатель ID
	receiverName?: string; // Грузополучатель наименование
	receiverAddress?: string; // Грузополучатель адрес
	receiverUnp?: string; // Грузополучатель УНП
	receiverProviderId?: string;

	// Заказчик
	freightPayerGln?: string; // Заказчик GLN
	freightPayerId?: number; // Заказчик ID
	freightPayerName?: string; // Заказчик наименование
	freightPayerUnp?: string; // Заказчик адрес

	// Место погрузки
	shipFrom?: {
		id?: number;
		gln?: string;
		address?: string;
		contact?: string;
	};

	// Место разгрузки
	shipTo?: {
		id?: number;
		gln?: string;
		address?: string;
		contact?: string; 	//Принял грузополучатель Наименование
	};

	// Транспортные реквизиты
	transportNumber?: string; // Марка и номер авто
	trailerNumber?: string; // Марка и номер прицепа
	waybillNumber?: string; // К путевому листу №
	transportOwnerName?: string; // Владелец транспорта
	transportContact?: string; // ФИО водителя
	quantityTrip?: string; // кол-во заездов (maybe number?)

	// Реквизиты ответственных лиц
	shipperContact?: string; // Отпуск разрешил
	shipFromContact?: string; // Сдал грузоотправитель
	shipperSealNumber?: string; // № пломбы
	deliveryContact?: string; // Товар к перевозке принял
	proxyDate?: Date; // По доверенности(дата)
	proxyNumber?: string; // По доверенности(номер)
	partyIssuingProxyName?: string; // Название организации, выдавшей доверенность
	baseShippingDocumentName?: string; // Основание доставки(наименование) only for TN
	baseShippingDocumentNumber?: string; // Основание доставки(номер) only for TN
	baseShippingDocumentDate?: Date; // Основание доставки(дата) only for TN

	// С товаром переданы документы
	msgEwaybillDocList?: EwaybillAttachedDocumentsForm[];

	// Дополнительные поля
	msgEwaybillExtraFieldList?: ExtraFieldForm[];
	msgEwaybillResponseActDtoList?: any[];

	//Принял грузополучатель
	receiverSealNumber?: string; //№ пломбы

	//Отметки о составленных актах
	reportName?: string; //Наименование
	reportID?: string; //Номер
	reportDate?: string; //Дата

	msgEwaybillProductList: EwaybillProduct[];

	totalAmountExcise?: string;
	totalAmountVat?: string;
	totalAmountWithVat?: string;
	totalAmountWithoutVat?: string;
	totalGrossWeight?: string;
	totalLine?: number;
	totalQuantity?: string;
	totalQuantityLu?: string;

	functionCode?: string;

	msgReceiverGln?: string;
	msgReceiverId?: number;
	msgSenderGln?: string;
	msgSenderId?: number;
	deliveryNoteType?: string;
	msgType?: MessageType;
	// msgNumber?: number;
	// msgDate?: Date;
	// documentNumber?: number;
	documentDate?: Date;

	deliveryError?: string;
	blrapnDesc?: string;
	dateCreate?: Date;
	freightPayerAddress?: string;
	deliveryStatus?: number;
	formSettings?: {
		isPublicGlnAtShipTo: boolean;
		isPublicGlnAtShipFrom: boolean;
		isAutoSum: boolean;
		productsPositionWithAutoSum: number[];
	};
}

export interface EwaybillReceived extends Ewaybill {
	msgNumber: string;
	msgDate: Date;
	documentNumber: string;
	userId: number;
}

export interface ChangeRequestEwaybillDocument extends DocumentSignature {
	changeReason: string;
}

export interface EwaybillProduct {
	position: number; // Позиция товара в списке
	gtin: string; // GTIN 
	codeByBuyer: string; // Номер товара, приcвоеный покупателем
	codeBySupplier: string; // Номер товара, приcвоеный продавцом
	fullName: string; // Наименование товара
	uom: UnitOfMeasure; // Единица измерения
	quantityDespatch: number; // Количество
	priceNet: number; // Цена, Br
	priceManufacturer: number; // Цена изготовителя
	discountBulkRate: number; // Оптовая скидка
	discountRate: number; // Скидка, %
	vatRate: number; // Ставка, НДС
	amountExcise: number; //Сумма акциза
	quantityDespatchLu: number; // Количество грузовых мест
	grossWeight: number; // Масса груза, тонны
	countryOfOrigin: Country; // Страна производства
	expireDate: Date; // Срок реализации
	addInfo: string; // Примечание
	msgEwaybillItemCertList: ProductDocumentInformation[]; // Информация о документе
	msgEwaybillExtraFieldList: ExtraFieldForm[]; // Дополнительные поля
	amountVat: number; // Cтоимость, Br
	amountWithVat: number; // Сумма НДС, Br
	amountWithoutVat: number; // Сумма с НДС, Br
}

export interface ProductDocumentInformation {
	certType: { id: string; code: string; nameFull: string; nameShort: string }; // Название
	certNumber: string; // Номер
	dateFrom: Date; // Дата с 
	dateTo: Date; // Дата до 
	certPartyIssuingName: string; // Кем выдан
}

export interface ResponseDraftInfo {
	id: number;
	processingStatus: Status;
}
