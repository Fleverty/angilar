import { DocumentKind, MessageType } from "./documents";

export interface Draft<T extends DocumentKind> {
	documentId: string;
	xmlString?: string;
	draftType?: DraftType;
	time?: Date;
	document: T;
}

export interface SignedDraft<T extends DocumentKind> {
	documentId: string;
	xmlString: string;
	draftType: DraftType;
	time: Date;
	document: T;
}

export type DraftType = MessageType;
export interface SignedDraftDto {
	certificateId: string;
	creationSignatureDate: string;
	creationSignatureTime: string;
	info: {
		[key: string]: any;
	};
	signatureValue: string;
	signatureBase64: string;
	signedXml: string;
	securityPartyId: string;
}

export interface DraftDto {
	id: number;
	xmlBody: string;
}
