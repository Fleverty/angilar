export interface OperationsConfirmByProvider {
	ewaybillCancelReceivingConfirmSubunit: OperationsConfirmByProviderSubunit; //Подтверждение получения отмены электронной накладной
	ewaybillCancelSendingSubunit: OperationsConfirmByProviderSubunit; //Отправка отмены электронной накладной
	ewaybillReceivingConfirmSubunit: OperationsConfirmByProviderSubunit; //Подтверждение получения электронной накладной
	notificationAboutChangeReceivingConfirmSubunit: OperationsConfirmByProviderSubunit[]; //Подтверждение получения уведомления об изменении
	notificationAboutChangeSendingSubunit: OperationsConfirmByProviderSubunit[]; //Отправка уведомления об изменении
	receiverProvider: PartyConfirm; //EDI-провайдер грузополучателя
	responseOnEwaybillReceivingConfirmSubunit: OperationsConfirmByProviderSubunit; //Подтверждение получения ответа на электронную накладную
	responseOnEwaybillSendingSubunit: OperationsConfirmByProviderSubunit; //Отправка ответа на электронную накладную
	sendingEwaybillSubunit: OperationsConfirmByProviderSubunit; //Отправка электронной накладной
	shipperProvider: PartyConfirm; //EDI-провайдер грузоотправителя
}

export interface OperationsConfirmByProviderSubunit {
	receiverProviderReceivingConfirm: Date; //Подтверждение о получении для EDI-провайдера грузополучателя
	receiverProviderSendingConfirm: Date; //Подтверждение об отправке для EDI-провайдера грузополучателя
	receivingTimestamp: Date; //Дата и время получения
	shipperProviderReceivingConfirm: Date; //Подтверждение о получении для EDI-провайдера грузоотправителя
	shipperProviderSendingConfirm: Date; //Подтверждение об отправке для EDI-провайдера грузоотправителя
	shipperProviderReceivingConfirmBlrapn: BlrapnData;
	shipperProviderSendingConfirmBlrapn: BlrapnData;
	receiverProviderReceivingConfirmBlrapn: BlrapnData;
	receiverProviderSendingConfirmBlrapn: BlrapnData;
}

interface BlrapnData {
	id: number;
	blrapnCode: number;
}

export interface PartyConfirm {
	id: number;
	name: string;
	gln: string;
	ewaybillProviderCode: string;
	legalName: string;
}

export interface ProviderConfirmation {
	id: number;
	operationList: ConfirmedOperation[]; //Операция подтвержденная провайдером
}

export interface ConfirmedOperation {
	operationCode: string; //Код операции
	operationName: string; // "Наименование операции
	operationDate: Date; //Дата операции (Дата и время получения)
	confirmDateReceived: Date; //Подтверждение о получении
	confirmDateSent: Date; //Подтверждение об отправке
}
