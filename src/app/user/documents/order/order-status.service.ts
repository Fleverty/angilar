import { Injectable } from "@angular/core";

@Injectable()
export class OrderStatusService {
	public processingStatus: Map<number, string> = new Map([
		[2, "Передан"],
		[3, "Принят"],
		[4, "Принят с изменениями"],
		[5, "Отклонен поставщиком"],
		[6, "Отменен покупателем"],
		[7, "Принят. Отменен покупателем"]
	]);

	public deliveryStatus: Map<number, string> = new Map([
		[0, "Не отправлен"],
		[1, "Доставляется"],
		[2, "Доставлен"],
		[3, "Ошибка при доставке"],
		[4, "Загружен в ERP систему получателя"],
		[5, "Ошибка при загрузке в ERP систему получателя"],
		[6, "Документ прочитан получателем"]
	]);

	public getProcessingStatusById(id: number): string {
		return this.processingStatus.get(id) || "";
	}

	public getDeliveryStatusById(id: number): string {
		return this.deliveryStatus.get(id) || "";
	}
}
