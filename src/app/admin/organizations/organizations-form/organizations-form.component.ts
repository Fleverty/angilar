import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { Document } from "@helper/abstraction/documents";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-organizations-form",
	templateUrl: "./organizations-form.component.html",
	styleUrls: ["./organizations-form.component.scss"]
})
export class OrganizationsFormComponent {

	public selectedDocuments: Document[] = [];
	public testProperties = JSON.parse("[{\"type\":\"status\",\"key\":\"processingStatus\",\"name\":\"Статус\"},{\"type\":\"date\",\"key\":\"dateTime\",\"name\":\"Дата и время\"},{\"key\":\"documentNumber\",\"name\":\"Номер документа\"},{\"type\":\"date\",\"key\":\"documentDate\",\"name\":\"Дата документа\"},{\"key\":\"sender\",\"name\":\"Грузоотправитель\"},{\"key\":\"receiver\",\"name\":\"Грузополучатель\"},{\"key\":\"deliveryPlace\",\"name\":\"Место доставки\"},{\"key\":\"shipmentPlace\",\"name\":\"Место отгрузки\"},{\"type\":\"boolean\",\"key\":\"responseExist\",\"name\":\"Отправлен ответ\"}]");
	public testData = JSON.parse("[{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-26T15:12:18.921+0300\",\"documentNumber\":\"004-2352472999992-1005\",\"documentDate\":\"2018-01-26\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-26T15:14:16.032+0300\",\"documentNumber\":\"004-2352472999992-1006\",\"documentDate\":\"2018-01-26\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"shipmentPlace\":\"220048, Беларусь, Минск, ул. Янки Лучины, д. 88\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-26T15:15:20.482+0300\",\"documentNumber\":\"004-2352472999992-1007\",\"documentDate\":\"2018-01-26\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-26T15:16:52.826+0300\",\"documentNumber\":\"004-2352472999992-1008\",\"documentDate\":\"2018-01-26\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-01-15T11:50:36.039+0300\",\"documentNumber\":\"004-2352472999992-975\",\"documentDate\":\"2018-01-15\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-01-17T14:54:23.179+0300\",\"documentNumber\":\"004-2352472999992-978\",\"documentDate\":\"2018-01-15\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-18T16:14:33.584+0300\",\"documentNumber\":\"004-2352472999992-982\",\"documentDate\":\"2018-01-18\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED\",\"name\":\"Создана и подтверждена\"},\"dateTime\":\"2018-02-14T17:17:23.393+0300\",\"documentNumber\":\"004-2352474999990-1356\",\"documentDate\":\"2018-02-07\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":true},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-05T11:04:23.213+0300\",\"documentNumber\":\"004-2352475999999-890\",\"documentDate\":\"2018-01-05\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220000, Беларусь, Гродненская обл., Гродно, ул. Советская, д. 1\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-03-13T16:47:41.707+0300\",\"documentNumber\":\"004-2352472999992-1376\",\"documentDate\":\"2018-03-13\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220048, Беларусь, Брестская обл., Брест,  \",\"shipmentPlace\":\"220048, Беларусь, Минск, ул. Янки Лучины, д. 88\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-18T15:11:37.223+0300\",\"documentNumber\":\"004-2352472999992-981\",\"documentDate\":\"2018-01-18\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-01-17T14:37:59.761+0300\",\"documentNumber\":\"004-2352472999992-978\",\"documentDate\":\"2018-01-15\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":true},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-17T11:41:01.839+0300\",\"documentNumber\":\"004-2352472999992-974\",\"documentDate\":\"2018-01-17\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-17T10:12:45.902+0300\",\"documentNumber\":\"004-2352472999992-971\",\"documentDate\":\"2018-01-17\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED\",\"name\":\"Создана и подтверждена\"},\"dateTime\":\"2018-01-16T17:59:58.883+0300\",\"documentNumber\":\"004-2352472999992-968\",\"documentDate\":\"2018-01-16\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":true},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-16T11:07:26.097+0300\",\"documentNumber\":\"004-2352472999992-965\",\"documentDate\":\"2018-01-16\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-01-16T11:00:30.039+0300\",\"documentNumber\":\"004-2352474999990-964\",\"documentDate\":\"2018-01-16\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED_CANCEL_SENT\",\"name\":\"Создана и подтверждена. Отправлена отмена\"},\"dateTime\":\"2018-04-09T16:07:35.553+0300\",\"documentNumber\":\"004-2352474999990-29566\",\"documentDate\":\"2018-04-09\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Ювелирный завод (Юлия)\",\"deliveryPlace\":\"220000, Беларусь, Гродненская обл., Гродно, ул. Советская, д. 1\",\"shipmentPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED\",\"name\":\"Создана\"},\"dateTime\":\"2018-03-14T18:02:43.793+0300\",\"documentNumber\":\"004-2352474999990-1039180054\",\"documentDate\":\"2018-03-13\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED\",\"name\":\"Создана и подтверждена\"},\"dateTime\":\"2018-03-15T17:47:58.158+0300\",\"documentNumber\":\"004-2352474999990-1773\",\"documentDate\":\"2018-03-15\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED\",\"name\":\"Создана\"},\"dateTime\":\"2018-03-15T17:47:42.401+0300\",\"documentNumber\":\"004-2352474999990-1772\",\"documentDate\":\"2018-03-15\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED_CANCEL_SENT\",\"name\":\"Создана и подтверждена. Отправлена отмена\"},\"dateTime\":\"2018-02-15T12:06:20.245+0300\",\"documentNumber\":\"004-2352474999990-1357\",\"documentDate\":\"2018-02-15\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":\"220048, Беларусь, Минск, ул. Янки Лучины, д. 88\",\"shipmentPlace\":\"220048, Беларусь, Брестская обл., Брест,  \",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED\",\"name\":\"Создана\"},\"dateTime\":\"2018-03-15T16:51:33.158+0300\",\"documentNumber\":\"004-2352474999990-1758\",\"documentDate\":\"2018-03-15\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED_CANCEL_SENT\",\"name\":\"Создана и подтверждена. Отправлена отмена\"},\"dateTime\":\"2018-04-11T11:38:52.535+0300\",\"documentNumber\":\"004-2352475999999-31653\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"220000, Беларусь, Гродненская обл., Гродно, ул. Советская, д. 1\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-03-16T15:30:41.761+0300\",\"documentNumber\":\"004-2352472999992-2176\",\"documentDate\":\"2018-03-16\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-03-16T15:42:46.311+0300\",\"documentNumber\":\"004-2352472999992-2177\",\"documentDate\":\"2018-03-16\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-04-02T16:23:44.817+0300\",\"documentNumber\":\"004-2352472999992-25343\",\"documentDate\":\"2018-04-02\",\"sender\":\"Деревообрабатывающий комбинат\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220051, Беларусь, Гродненская обл., Лида, ул. Советская, д. 4, оф. 21\",\"shipmentPlace\":\"220048, Беларусь, Минск, ул. Янки Лучины, д. 88\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"TRANSFERRED\",\"name\":\"Передана\"},\"dateTime\":\"2018-03-20T17:35:50.760+0300\",\"documentNumber\":\"004-2352500999994-1442023817\",\"documentDate\":\"2018-03-13\",\"sender\":\"Лисички и котики\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"shipmentPlace\":\"220000, Беларусь, Брестская обл., брест,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED\",\"name\":\"Создана и подтверждена\"},\"dateTime\":\"2018-03-26T16:44:09.396+0300\",\"documentNumber\":\"004-2352474999990-7246\",\"documentDate\":\"2018-03-26\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220048, Беларусь, Брестская обл., Брест,  \",\"shipmentPlace\":\"225921, Беларусь, д.Дворище, ул. Рогачевская\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T11:44:14.873+0300\",\"documentNumber\":\"004-2352475999999-31656\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"234234, Беларусь, Брестская обл., Береза, ул. Советская, д. 12\",\"shipmentPlace\":\"220024, Беларусь, Брест 3,  \",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T11:43:59.757+0300\",\"documentNumber\":\"004-2352475999999-31655\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"234234, Беларусь, Брестская обл., Береза, ул. Советская, д. 12\",\"shipmentPlace\":\"220024, Беларусь, Брест 3,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T11:38:26.686+0300\",\"documentNumber\":\"004-2352475999999-31652\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"220000, Беларусь, Гродненская обл., Гродно, ул. Советская, д. 1\",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T15:48:40.807+0300\",\"documentNumber\":\"004-2352475999999-31665\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED\",\"name\":\"Создана и подтверждена\"},\"dateTime\":\"2018-04-11T17:13:31.218+0300\",\"documentNumber\":\"004-2352475999999-32436\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"220032, Беларусь, бульв. Шевченко, корп. 32, оф. 32\",\"shipmentPlace\":\"220000, Беларусь, Гродненская обл., Гродно, ул. Советская, д. 1\",\"responseExist\":true},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T17:20:57.123+0300\",\"documentNumber\":\"004-2352475999999-32438\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CREATED_CONFIRMED_CANCEL_SENT\",\"name\":\"Создана и подтверждена. Отправлена отмена\"},\"dateTime\":\"2018-04-10T10:00:47.707+0300\",\"documentNumber\":\"004-2352474999990-31585\",\"documentDate\":\"2018-04-09\",\"sender\":\"Швейная фабрика\",\"receiver\":\"Деревообрабатывающий комбинат\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":true},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T15:47:55.421+0300\",\"documentNumber\":\"004-2352475999999-31666\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T15:49:09.357+0300\",\"documentNumber\":\"004-2352475999999-31658\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T15:49:21.236+0300\",\"documentNumber\":\"004-2352475999999-31657\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":\"234234, Беларусь, Брестская обл., Береза, ул. Советская, д. 12\",\"shipmentPlace\":\"220024, Беларусь, Брест 3,  \",\"responseExist\":false},{\"processingStatus\":{\"id\":\"CANCELED\",\"name\":\"Отменена\"},\"dateTime\":\"2018-04-11T15:49:42.566+0300\",\"documentNumber\":\"004-2352475999999-32208\",\"documentDate\":\"2018-04-11\",\"sender\":\"Ювелирный завод (Юлия)\",\"receiver\":\"Швейная фабрика\",\"deliveryPlace\":null,\"shipmentPlace\":null,\"responseExist\":true}]");

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

	public filterChanged(data: {}): {} {
		return data;
	}

	public documentsSelected(docs: Document[]): void {
		this.selectedDocuments = docs;
		this.changeDetectorRef.detectChanges();
	}
}
