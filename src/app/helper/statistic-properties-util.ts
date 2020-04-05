import { DocumentProperty, DocumentType } from "./abstraction/documents";

export class StatisticPropertiesUtil {
	private static readonly statisticProperties: { [key in Extract<DocumentType, "EWAYBILL" | "ORDERS">]: DocumentProperty[] } = {
		EWAYBILL: [
			{
				type: "status",
				key: "processingStatus",
				name: "Статус обработки",
			},
			{
				type: "date",
				key: "dateCreate",
				name: "Дата и время создания",
			},
			{
				key: "deliveryNoteNumber",
				name: "Серия и номер",
			},
			{
				type: "date",
				key: "documentDate",
				name: "Дата",
			},
			{
				type: "person",
				key: "shipper",
				name: "Грузоотправитель",
			},
			{
				type: "person",
				key: "receiver",
				name: "Грузополучатель",
			},
			{
				type: "place",
				key: "shipFrom",
				name: "Место погрузки",
			},
			{
				type: "place",
				key: "shipTo",
				name: "Место отгрузки",
			},
			{
				key: "contractNumber",
				name: "Договор №",
			},
			{
				type: "type",
				key: "msgType",
				name: "Тип",
			},
			{
				type: "boolean",
				key: "testIndicator",
				name: "Тестовая"
			}
		],
		ORDERS: [
			{
				key: "buyerName",
				name: "Покупатель",
			},
			{
				key: "supplierName",
				name: "Поставщик",
			},
			{
				key: "deliveryPointAddress",
				name: "Место доставки",
			},
			{
				key: "order",
				name: "Заказ",
				type: "double",
				children: [
					{
						key: "number",
						name: "Номер"
					},
					{
						key: "date",
						name: "Дата",
						type: "date",
					},
				]
			},
			{
				key: "orderspList",
				name: "Ответ на заказ",
				type: "array",
				children: [
					{
						key: "number",
						name: "Номер"
					},
					{
						key: "date",
						name: "Дата",
						type: "date",
					},
				]
			},
			{
				key: "desadvList",
				name: "Уведомление об отгрузке",
				type: "array",
				children: [
					{
						key: "number",
						name: "Номер"
					},
					{
						key: "date",
						name: "Дата",
						type: "date",
					},
				]
			},
		]
	};

	public static getProperties(type: Extract<DocumentType, "EWAYBILL" | "ORDERS">): DocumentProperty[] {
		if (this.statisticProperties[type]) {
			return this.statisticProperties[type];
		} else {
			return this.statisticProperties.EWAYBILL;
		}
	}
}
