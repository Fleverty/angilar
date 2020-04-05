import { DraftType } from "./draft";
import { Ewaybill, EwaybillResponse } from "./ewaybill";
import { ShipmentNotification } from "@app/user/documents/shipment-notification/shipment-notification";
import { EinvoicepmtDto as Einvoicepmt } from "./einvoicepmt";
import { Einvoice } from "./einvoice";
import { Order } from "./order";

export interface DocumentsParams {
	page: number;
	size: number;
	documentDateEnd: Date;
	documentDateStart: Date;
	documentTypeId: DocumentType;
	documentStage: DocumentStage; // Этап обработки документа: Все, Новые, В работе, Обработаны
	documentState: DocumentState; // Состояние документа: Черновик, Входящие, Исходящие
	processingStatusId?: string;
	documentNumber?: string;
	partnerId?: string;
	storageId?: string;
}


export interface DocumentBody {
	documentNumber?: string;
	documentDateStart: Date;
	documentDateEnd: Date;
	partnerId?: string;
	storageId?: string;
	documentStage: DocumentStage;
	processingStatusId?: string;
}

export interface EditDocumentsParams extends DocumentParams {
	draftId: string;
}

export interface CreateDocumentParams extends DocumentParams {
	isTest: boolean;
}

export interface DocumentParams {
	draftType: DraftType;
}

export type DocumentsDto = Document[];

export interface Document {
	id: string;
	status?: string;
	messageType: MessageType;
	processingStatus?: {
		id: string;
		name: string;
	};
	documentNumber?: string;
	documentDate?: string;
	signatureDate?: string;
	signatureTime?: string;
	documentNameCode?: string;
}

export interface DocumentProperty {
	type?: string;
	key: string;
	name: string;
	children?: DocumentProperty[];
}

export type DocumentKind = Ewaybill | EwaybillResponse | ShipmentNotification | Order | Einvoice | Einvoicepmt;

export type DocumentStage = "ALL" | "NEW" | "INWORK" | "PROCESSED";

export type DocumentState = "DRAFT" | "INCOMING" | "OUTGOING";

export type DocumentType = "EWAYBILL" | "ORDERS" | "DESADV" | "ORDRSP" | "EINVOICE" | "EINVOICEPMT";

export type MessageType = "BLRWBL" | "BLRDLN" | "ORDERS" | "DESADV" | "ORDRSP" | "BLRDNR" | "BLRWBR" | "BLRINV" | "BLRPMT";

export interface DescriptionDocumentType {
	id: DocumentType;
	name: string;
}

export type KindByMessageType<T> =
	T extends "BLRWBL" ? Ewaybill :
	T extends "BLRDLN" ? Ewaybill :
	T extends "BLRDNR" ? Ewaybill :
	T extends "BLRWBR" ? Ewaybill :
	T extends "BLRINV" ? Einvoice :
	T extends "ORDERS" ? Order :
	T extends "DESADV" ? ShipmentNotification :
	T extends "BLRPMT" ? Einvoicepmt :
	never;

export interface DocumentFromAnotherParams {
	destinationDocumentType: MessageType;
	id: number;
	sourceDocumentType: MessageType;
	testIndicator: boolean;
}

export type DocumentsTypesDto = DocumentType[];

export interface ExportDocument {
	documentIdList: number[];
	msgType: MessageType;
}

export interface NewInboxDocumentsCountDto {
	newOrdMessagesNumber: number;
	newDesadvMessagesNumber: number;
	newEwaybillMessagesNumber: number;
}

export type NewInboxDocuments = {
	[key in DocumentType]?: number;
};

export interface MassSendReport {
	failedCount: number;
	successCount: number;
	errorReports: MassSendItemReport[];
}

interface MassSendItemReport {
	documentId: number;
	documentNumber: string;
	errorMessage: string;
	exception: {
		cause: {
			localizedMessage: string;
			message: string;
		};
	};
}
