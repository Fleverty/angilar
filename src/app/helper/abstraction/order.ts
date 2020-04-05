import { Currency } from "./currency";
import { DraftType } from "./draft";
import { UnitOfMeasure } from "./unit-of-measures";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Order extends Omit<OrderParams, "msgOrdersItems"> {
	responseDocument?: OrderResponse;
	documentResponseList?: OrderResponse[];
	msgOrdersItems?: OrderProduct[];
}

export interface OrderResponse extends Omit<OrderResponseParams, "msgOrdrspItems"> {
	msgOrdrspItems?: OrderProduct[];
}

export type OrderProductAction = 1 | 3 | 5 | 7;

export interface OrderProduct {
	action: OrderProductAction;
	position: string;
	gtin: string;
	codeByBuyer: string;
	codeBySupplier: string;
	fullName: string;
	uom: UnitOfMeasure;
	quantity: number;
	priceNet: number;
	vatRate: number;
	quantityInPack: number;
	type: "CN" | "CU";
	amountWithoutVat: number;
	amountVat: number;
	amountWithVat: number;
	autoSum: boolean;
	quantityOrderedLu: number;
	quantityOrdered: number;
	quantityAccepted: number;
}

export interface OrderFormSettings {
	autoSum: boolean;
	items: boolean[];
}

export interface OrderParams {
	draftType?: DraftType;
	draftId: string;
	autoSum?: boolean; //Признак автосумма для всех товаров
	buyerGln?: string; //GLN Покупателя
	buyerId?: number; //Идентификатор покупателя
	buyerName?: string; //Наименование покупателя
	contractNumber?: string; //Номер договора, на основании которого отпущен товар
	currency?: Currency; // Валюта
	dateCreate?: Date; //Дата и время создания черновика
	deliveryDate?: Date; //Дата и время доставки
	deliveryError?: string; //Текст ошибки при доставке или загрузке в ERP систему получателя
	deliveryPointAddress: string; //Адрес места доставки
	deliveryPointGln: string; //GLN места доставки
	deliveryPointId: number; //Идентификатор места доставки
	deliveryPointName: string;
	deliveryStatus?: number; //Статус доставки сообщения
	documentDate?: Date; //Дата заказа
	documentNameCode?: OrderKind; //Вид заказа. 220 - заказ на поставку; 22E - инициативный заказ, сформированный поставщиком; 70E - заказ на возврат товара
	documentNumber: number; //Номер заказа, присвоенный отправителем
	freightPayerAddress?: string; //Адрес заказчика
	freightPayerGln?: string; //GLN заказчика
	freightPayerId?: number; //Идентификатор заказчика
	freightPayerName?: string; //Наименование заказчика
	freightPayerUnp?: string; //УНП заказчика
	functionCode?: string;
	ordersNumber?: string;
	id?: number; //Номер заказа, присвоенный системой
	msgDate?: string | null; //Дата и время сообщения/доставки
	msgNumber?: string; //Номер сообщения/доставки
	msgOrdersItems?: OrderProductParams[]; //Заказы
	msgOrdrspItems?: OrderProductParams[];
	msgReceiverGln?: string; //GLN-номер сообщения получателя
	msgReceiverId?: number; //Идентификатор получателя
	msgSenderGln?: string; //GLN-номер сообщения отправителя
	msgSenderId?: number; //Идентификатор сообщения организации отправителя
	msgVersion?: string;
	orderComment?: string; //Комментарий к заказу
	orderContactEmail?: string; //Email оператора, создавшего заказ
	orderContactName?: string; //ФИО оператора, создавшего заказ
	orderContactPhone?: string; //Телефон оператора, создавшего заказ
	originalOrdersId?: number; //Номер заказа, который заменяется.
	ordersId?: number;
	position?: number; //Порядковый номер товара
	processingStatus?: number; //Статус обработки документа. Формируется автоматически.Cтатус по умолчанию Черновик
	shipmentDate?: Date; //Дата и время отгрузки
	supplierGln: string; //GLN поставщика
	supplierId: number; //Идентификатор поставщика
	supplierName: string; //Наименование поставщика
	totalAmountVat?: string; //Общая сумма НДС
	totalAmountWithVat?: string; //Общая сумма с НДС
	totalAmountWithoutVat?: string; //Общая сумма без НДС
	totalLine?: string; //Общее количество товаров в накладной (общее количество всех товаров)
	totalQuantity?: string; // Общее количество единиц товара (количество всех доставленных товаров)
	totalQuantityLu?: string; //Общее количество логистических единиц (упаковок) товара
	ultimateRecipientAddress?: string; //Адрес конечного получателя
	ultimateRecipientGln?: string; //GLN конечного получателя
	ultimateRecipientId?: number; //Идентификатор конечного получателя
	userId?: number; //Идентификатор пользователя
	ordrspComment?: string;
	orderDeliveryDate?: Date;
	ordrspDeliveryDate?: Date;
	formSettings: OrderFormSettings;
	commentText: string;
}

export interface OrderResponseParams extends OrderParams {
	orderMsgDraftDto?: OrderParams;
}

export interface OrderProductParams {
	action: OrderProductAction;
	amountVat: number;
	amountWithVat: number;
	amountWithoutVat: number;
	autoSum: boolean;
	codeByBuyer: string;
	codeBySupplier: string;
	fullName: string;
	gtin: string;
	uom: UnitOfMeasure;
	position: string;
	priceNet: number;
	quantityInPack: number;
	quantityAccepted?: number;
	quantityOrdered: number;
	quantityOrderedLu: number;
	type: "CU" | "RC"; // CU - товар, RC - тара
	vatRate: number;
	forbidDeleting: boolean;
}

export interface EditOrderParams {
	draftId: number;
	draftType: DraftType;
	kind: OrderKind;
}

export type OrderKind = "220" | "22E" | "70E";
