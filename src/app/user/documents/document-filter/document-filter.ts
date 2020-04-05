import { DocumentsParams, DocumentStage, DocumentState, DocumentType } from "@helper/abstraction/documents";

export interface DocumentsFilterConstructorParams {
	documentTypeId: DocumentType;
	documentStage: DocumentStage;
	documentState: DocumentState;
	page?: number;
	size?: number;
	documentDateEnd?: Date;
	documentDateStart?: Date;
	processingStatusId?: string;
	documentNumber?: string;
	partnerId?: string;
	storageId?: string;
}

export class DocumentsFilter implements DocumentsParams {
	public documentTypeId: DocumentType;
	public documentStage: DocumentStage; // Этап обработки документа: Все, Новые, В работе, Обработаны
	public documentState: DocumentState; // Состояние документа: Черновик, Входящие, Исходящие

	public page: number;
	public size: number;
	public documentDateEnd: Date;
	public documentDateStart: Date;

	public processingStatusId?: string;
	public documentNumber?: string;
	public partnerId?: string;
	public storageId?: string;
	private createAt?: Date;

	constructor(filter: DocumentsFilterConstructorParams) {
		this.createAt = new Date();
		this.documentTypeId = filter.documentTypeId;
		this.documentStage = filter.documentStage;
		this.documentState = filter.documentState;
		this.page = filter.page || 1;
		this.size = filter.size || 40;
		this.documentDateEnd = filter.documentDateEnd || new Date(this.createAt.getFullYear(), this.createAt.getMonth(), this.createAt.getDate(), 23, 59, 59, 59);
		this.documentDateStart = filter.documentDateStart || new Date(this.createAt.getFullYear(), this.createAt.getMonth(), this.createAt.getDate());
		this.processingStatusId = filter.processingStatusId;
		this.documentNumber = filter.documentNumber;
		this.partnerId = filter.partnerId;
		this.storageId = filter.storageId;
	}
}
