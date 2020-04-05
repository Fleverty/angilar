import { EinvoiceProduct } from "@helper/abstraction/einvoice";
// import { EinvoiceAttachedDocumentsForm } from "./Einvoice-attached-documents/Einvoice-attached-documents.component";
import { ExtraFieldForm } from "./einvoice-extra-information/einvoice-extra-information.component";
import { Currency } from "@helper/abstraction/currency";
import { Big } from "big.js";
import { DraftType } from "@helper/abstraction/draft";
import { EinvoiceForm, TotalSumsForm as ITotalSums, TotalSumsForm } from "./einvoice-form";

export class EinvoiceDocument {
	public documentNumber?: string;
	// Общая информация
	public id?: number;
	// public testIndicator: boolean; // Тестовая
	public processingStatus?: string; // Статус
	// public deliveryNoteNumber: string; // Серия // Номер
	public deliveryNoteDate?: Date; // Дата создания(дата)
	public ordersNumber?: string; // Номер заказа
	public contractNumber?: string; // Номер договора
	public contractDate?: Date; // Дата договора
	public contractName?: string; // Наименование договора
	// public currency?: Currency; // Валюта
	public nsiCurrency?: Currency; // Валюта
	public invoiceNumber?: string;

	// Поставщик/Исполнитель
	public supplierId?: number; // Идентификатор поставщика
	public supplierGln?: string; // GLN поставщика
	public supplierName?: string; // Наименование поставщика
	public supplierUnp?: string; // УНП поставщика
	public supplierAddress?: string; // Адрес поставщика
	// ??? Расчетный счет Поставщика ???
	public supplierBankName?: string; // Банк Поставщика
	public supplierBankCode?: string; // Код банка Поставщика
	public supplierBankAddress?: string; // Адрес банка Поставщика
	public supplierMsgSenderGln?: string;
	public supplierMsgNumber?: string;
	public supplierMsgDate?: Date;

	// Покупатель/Заказчик
	public buyerId?: number;
	public buyerName?: string;
	public buyerGln?: string;
	public buyerUnp?: string;
	public buyerAddress?: string;
	public buyerAccountNumber?: string;
	public buyerBankName?: string;
	public buyerBankCode?: string;
	public buyerBankAddress?: string;

	// Грузоотправитель
	public shipperGln?: string; // Грузоотправитель GLN
	public shipperId?: number; // Грузоотправитель ID
	public shipperName?: string; // Грузоотправитель наименование
	public shipperAddress?: string; // Грузоотправитель адрес
	public shipperUnp?: string; // Грузоотправитель УНП
	public shipperProviderId?: string;

	// Грузополучатель 
	public receiverGln?: string; // Грузополучатель GLN
	public receiverId?: number; // Грузополучатель ID
	public receiverName?: string; // Грузополучатель наименование
	public receiverAddress?: string; // Грузополучатель адрес
	public receiverUnp?: string; // Грузополучатель УНП
	public receiverProviderId?: string;

	// Место погрузки
	public shipFrom: {
		id?: number;
		gln?: string;
		address?: string;
		contact?: string;
	}; // Место погрузки gln
	// Место разгрузки
	public shipTo: {
		id?: number;
		gln?: string;
		address?: string;
	};

	// Дополнительные поля
	public einvoiceItemExtraFieldList?: ExtraFieldForm[];

	public msgEinvoiceItemCollection: EinvoiceProduct[];

	public totalAmountExcise: string;
	public totalAmountVat: string;
	public totalAmountWithVat: string;
	public totalAmountWithoutVat: string;
	public totalLine: number;
	public totalQuantity: string;

	public functionCode = "9";

	// public msgReceiverGln?: string;
	// public msgReceiverId?: number;
	// public msgSenderGln?: string;
	// public msgSenderId?: number;
	public deliveryNoteType = "700";
	public msgType: DraftType = "BLRINV";
	public autoSum: boolean;
	public deliveryStatus?: number;
	public formSettings?: {
		isPublicGlnAtShipTo: boolean;
		isPublicGlnAtShipFrom: boolean;
		isAutoSum: boolean;
		productsPositionWithAutoSum: number[];
	};

	constructor(formValue: EinvoiceForm, products: EinvoiceProduct[], totalSums: TotalSumsForm, isAutoSum: boolean, draftType: DraftType) {
		this.id = formValue.id;
		this.processingStatus = "0";
		this.documentNumber = formValue.common && formValue.common.number;
		this.documentNumber = `${formValue.common && formValue.common.seria01}-${formValue.common && formValue.common.seria02}`;
		this.deliveryNoteDate = formValue.common && formValue.common.dateCreate;
		this.ordersNumber = formValue.common && formValue.common.ordersNumber;
		this.contractNumber = formValue.common && formValue.common.contractNumber;
		this.contractDate = formValue.common && formValue.common.contractDate;
		this.contractName = formValue.common && formValue.common.contractName;
		// this.currency = formValue.common && formValue.common.currency;
		this.nsiCurrency = formValue.common && formValue.common.currency;
		this.invoiceNumber = formValue.common && formValue.common.number;

		this.supplierId = formValue.supplier && formValue.supplier.supplierId;
		this.supplierGln = formValue.supplier && formValue.supplier.supplierGln;
		this.supplierName = formValue.supplier && formValue.supplier.supplierName;
		this.supplierUnp = formValue.supplier && formValue.supplier.supplierUnp;
		this.supplierAddress = formValue.supplier && formValue.supplier.supplierAddress;
		this.supplierBankName = formValue.supplier && formValue.supplier.supplierBankName;
		this.supplierBankCode = formValue.supplier && formValue.supplier.supplierBankCode;
		this.supplierBankAddress = formValue.supplier && formValue.supplier.supplierBankAddress;
		this.supplierMsgSenderGln = formValue.supplier && formValue.supplier.supplierGln;
		this.supplierMsgNumber = "";
		this.supplierMsgDate = new Date();

		// this.buyerId = formValue.buyer && formValue.buyer.buyerId;
		this.buyerId = 236;
		// this.buyerName = formValue.buyer && formValue.buyer.buyerName;
		this.buyerName = "Super Buyer";
		// this.buyerGln = formValue.buyer && formValue.buyer.buyerGln;
		this.buyerGln = "2352538999997";
		this.buyerUnp = formValue.buyer && formValue.buyer.buyerUnp;
		// this.buyerAddress = formValue.buyer && formValue.buyer.buyerAddress;
		this.buyerAddress = "buyer address";
		// this.buyerAccountNumber = formValue.buyer && formValue.buyer.buyerAccountNumber;
		this.buyerAccountNumber = "12345";
		// this.buyerBankName = formValue.buyer && formValue.buyer.buyerBankName;
		this.buyerBankName = "buyer bank name";
		// this.buyerBankCode = formValue.buyer && formValue.buyer.buyerBankCode;
		this.buyerBankCode = "123456";
		// this.buyerBankAddress = formValue.buyer && formValue.buyer.buyerBankAddress;
		this.buyerBankAddress = "bank address";

		this.shipperGln = formValue.shipper && formValue.shipper.gln;
		this.shipperId = formValue.shipper && formValue.shipper.id;
		this.shipperName = formValue.shipper && formValue.shipper.name;
		this.shipperAddress = formValue.shipper && formValue.shipper.address;
		this.shipperUnp = formValue.shipper && formValue.shipper.unp;
		// this.shipperProviderId = formValue.shipper && formValue.shipper.;

		this.receiverGln = formValue.consignee && formValue.consignee.gln;
		this.receiverId = formValue.consignee && formValue.consignee.id;
		this.receiverName = formValue.consignee && formValue.consignee.name;
		this.receiverAddress = formValue.consignee && formValue.consignee.address;
		this.receiverUnp = formValue.consignee && formValue.consignee.unp;
		// this.receiverProviderId = formValue.consignee && formValue.consignee.;


		// 	this.msgSenderGln = formValue.shipper && formValue.shipper.gln;
		// 	this.msgSenderId = formValue.shipper && formValue.shipper.dictionary.id;

		const loading = formValue.places && formValue.places.loading;

		this.shipFrom = loading ? {
			address: loading.address,
			gln: loading.gln,
			id: loading.loadingPoint && loading.loadingPoint.id || (loading.publicGln ? loading.publicGln.id : undefined),
			// contact: formValue.details && formValue.details.shipFromContact
		} : {};

		const unloading = formValue.places && formValue.places.unloading;
		this.shipTo = unloading ? {
			address: unloading.address,
			gln: unloading.gln,
			id: unloading.unloadingPoint && unloading.unloadingPoint.id || (unloading.publicGln ? unloading.publicGln.id : undefined)
		} : {};

		this.einvoiceItemExtraFieldList = formValue.extras && formValue.extras.documents || [];

		this.msgEinvoiceItemCollection = products.splice(0);

		this.functionCode = "9";
		this.deliveryNoteType = "700";
		this.msgType = draftType;

		this.totalAmountExcise = totalSums.amountExcise;
		this.totalAmountVat = totalSums.amountVat;
		this.totalAmountWithVat = totalSums.amountWithVat;
		this.totalAmountWithoutVat = totalSums.amountWithoutVat;
		this.totalLine = this.msgEinvoiceItemCollection.length;
		this.totalQuantity = totalSums.quantity;

		this.autoSum = isAutoSum;
		this.formSettings = {
			isAutoSum,
			isPublicGlnAtShipFrom: loading.isPublicGln,
			isPublicGlnAtShipTo: unloading.isPublicGln,
			productsPositionWithAutoSum: formValue.products.products.filter(e => e.autoSum).map((e, i) => i)
		};
	}
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type TotalSumsKeys = keyof Omit<ITotalSums, "isAutoSum">;

export class TotalSums implements ITotalSums {
	public quantity: string;
	public priceNet: string;
	public amountVat: string;
	public amountExcise: string;
	public vatRate: string;
	public amountWithVat: string;
	public amountWithoutVat: string;
	public isAutoSum: boolean;

	constructor(initValue?: Partial<ITotalSums>) {
		this.quantity = initValue && initValue.quantity || "0";
		this.priceNet = initValue && initValue.priceNet || "0";
		this.amountVat = initValue && initValue.amountVat || "0";
		this.amountExcise = initValue && initValue.amountExcise || "0";
		this.vatRate = initValue && initValue.vatRate || "0";
		this.amountWithVat = initValue && initValue.amountWithVat || "0";
		this.amountWithoutVat = initValue && initValue.amountWithoutVat || "0";
		this.isAutoSum = initValue && initValue.isAutoSum || true;
	}

	public calculate(products: EinvoiceProduct[]): TotalSums {
		const newSums = new TotalSums();
		Object.keys(newSums).forEach((key: string) => {
			if (key !== "isAutoSum")
				newSums[key as TotalSumsKeys] = products.reduce((acc, curr) => (new Big(acc)).plus(new Big(curr[key as TotalSumsKeys] || 0)), new Big(0)).round(2).toString();
		});
		return newSums;
	}
}
