export interface Signature {
	certificate: string;
	certificateUserName: string;
	signatureDate: Date;
	signatureTime: string;
}


export interface DocumentSignature {
	id: number;
	signature: Signature;
}
