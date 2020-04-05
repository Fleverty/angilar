import { DocumentProperty } from "./abstraction/documents";

export class DocumentPropertiesUtil {
	private static readonly documentProps: { [key: string]: DocumentProperty[] } = {
		EWAYBILL: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус обработки",
			},
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "sender",
				name: "Грузоотправитель",
			},
			{
				key: "receiver",
				name: "Грузополучатель",
			},
			{
				key: "deliveryPlace",
				name: "Место доставки",
			},
			{
				key: "shipmentPlace",
				name: "Место отгрузки",
			},
			{
				type: "boolean",
				key: "isResponseExist",
				name: "Отправлен ответ",
			}
		],
		EINVOICE: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус обработки",
			},
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "sender",
				name: "Поставщик",
			},
			{
				key: "receiver",
				name: "Покупатель",
			},
			{
				type: "boolean",
				key: "isResponseExist",
				name: "Отправлен ответ",
			}
		],
		DESADV: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус",
			},
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "sender",
				name: "Поставщик",
			},
			{
				key: "receiver",
				name: "Покупатель",
			},
			{
				key: "deliveryPlace",
				name: "Место доставки",
			},
			{
				key: "shipmentPlace",
				name: "Место отгрузки",
			}
		],
		ORDERS: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус",
			},
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "sender",
				name: "Покупатель",
			},
			{
				key: "receiver",
				name: "Поставщик",
			},
			{
				key: "deliveryPlace",
				name: "Место доставки",
			},
			{
				type: "date",
				key: "deliveryDate",
				name: "Дата доставки",
			},
			{
				type: "boolean",
				key: "isResponseExist",
				name: "Отправлен ответ",
			},
		],
		EINVOICEPMT: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус обработки",
			},
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "sender",
				name: "Поставщик",
			},
			{
				key: "receiver",
				name: "Покупатель",
			},
			{
				type: "date",
				key: "expireDate",
				name: "Срок действия",
			}
		],
		ANY: [
			{
				type: "date",
				key: "dateTime",
				name: "Дата и время",
			},
			{
				key: "deliveryPlace",
				name: "Место доставки",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата документа",
			},
			{
				key: "documentNumber",
				name: "Номер документа",
			},
			{
				type: "status",
				key: "processingStatus",
				name: "Статус",
			},
			{
				key: "receiver",
				name: "Грузополучатель",
			},
			{
				type: "boolean",
				key: "isResponseExist",
				name: "Отправлен ответ",
			},
			{
				key: "sender",
				name: "Грузоотправитель",
			},
		]
	};

	public static getProperties(type: string): DocumentProperty[] {
		if (this.documentProps[type]) {
			return this.documentProps[type];
		} else {
			return this.documentProps.ANY;
		}
	}
}
