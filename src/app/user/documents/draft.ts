import { Draft as IDarft, DraftType } from "@helper/abstraction/draft";

export class Draft<T> implements IDarft<T> {
	public documentId: string;
	public draftType: DraftType;
	public time: Date;
	public xmlString?: string; // js document
	public document: T;

	constructor(documentId: string, draftType: DraftType, document: T, xmlString?: string, time?: Date) {
		this.documentId = documentId;
		this.draftType = draftType;
		this.xmlString = xmlString;
		this.time = time || new Date();
		this.document = document;
	}
}
