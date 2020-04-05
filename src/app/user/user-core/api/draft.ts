import { Observable } from "rxjs";
import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EwaybillDocument } from "@app/user/documents/ewaybill/ewaybill";
import { DocumentKind, MessageType } from "@helper/abstraction/documents";
import { OrderParams } from "@helper/abstraction/order";
import { ShipmentNotification } from "@app/user/documents/shipment-notification/shipment-notification";
import { DraftType, DraftDto } from "@helper/abstraction/draft";
import { Ewaybill, EwaybillResponse } from "@helper/abstraction/ewaybill";
import { EinvoiceDto } from "@helper/abstraction/einvoice";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";

export class Draft {
	public getXml = {
		get$: (documentId: string, documentTypeId: string): Observable<any> => {
			const url = `${this.config.api.root}/draft/getXml/${documentTypeId}/${documentId}`;
			return this.http.get<any>(url, { withCredentials: true });
		}
	};

	public saveBLRWBL = {
		post$: (document: EwaybillDocument): Observable<number> => {
			const url = `${this.config.api.root}/draft/saveBLRWBL`;
			return this.http.post<number>(url, document, { withCredentials: true });
		}
	};

	public saveBLRDLN = {
		post$: (document: EwaybillDocument): Observable<number> => {
			const url = `${this.config.api.root}/draft/saveBLRDLN`;
			return this.http.post<number>(url, document, { withCredentials: true });
		},
	};

	public saveBLRPMT = {
		post$: (einvoicepmtDto: EinvoicepmtDto): Observable<number> => {
			const url = `${this.config.api.root}/draft/saveBLRPMT`;
			return this.http.post<number>(url, einvoicepmtDto, { withCredentials: true });
		}
	};

	public saveDESADV = {
		post$: (notification: ShipmentNotification): Observable<number> => {
			const url = `${this.config.api.root}/draft/saveDESADV`;
			return this.http.post<number>(url, notification, { withCredentials: true });
		}
	};

	public saveORDERS = {
		post$: (orderParams: Partial<OrderParams>, isValidate?: boolean): Observable<number> => {
			let params = new HttpParams();
			if (isValidate !== undefined) {
				params = params.set("isValidate", `${isValidate}`);
			}
			const url = `${this.config.api.root}/draft/saveORDERS`;
			return this.http.post<number>(url, { ...orderParams }, {
				withCredentials: true,
				params
			});
		}
	};

	public saveORDRSP = {
		post$: (orderParams: Partial<OrderParams>, isValidate?: boolean): Observable<number> => {
			let params = new HttpParams();
			if (isValidate !== undefined) {
				params = params.set("isValidate", `${isValidate}`);
			}
			const url = `${this.config.api.root}/draft/saveORDRSP`;
			return this.http.post<number>(url, { ...orderParams }, {
				withCredentials: true,
				params
			});
		}
	};

	public saveBLRINV = {
		post$: (document: Partial<EinvoiceDto>): Observable<number> => {
			const url = `${this.config.api.root}/draft/saveBLRINV`;
			return this.http.post<number>(url, document, { withCredentials: true });
		},
	};

	public find = {
		get$: <T extends DocumentKind>(draftType: DraftType, draftId: string): Observable<T> => {
			const url = `${this.config.api.root}/draft/find/${draftType}/${draftId}`;
			return this.http.get<T>(url, { withCredentials: true });
		},
	};

	public createWithValidation = {
		post$: (draftType: DraftType, msgEwaybillDraftDto: DocumentKind): Observable<DraftDto> => {
			const url = `${this.config.api.root}/draft/createWithValidation/${draftType}`;
			return this.http.post<DraftDto>(url, msgEwaybillDraftDto, { withCredentials: true });
		}
	};

	public saveSigned = {
		post$: (draftType: DraftType, documentDto: { id: string; xmlBody: string }): Observable<any> => {
			const url = `${this.config.api.root}/draft/saveSigned/${draftType}`;
			return this.http.post(url, documentDto, { withCredentials: true });
		}
	};

	public response = {
		find$: <T>(commonDocumentType: DraftType, responseId: number): Observable<T> => {
			const url = `${this.config.api.root}/draft/response/find/${commonDocumentType}/${responseId}`;
			return this.http.get<T>(url, { withCredentials: true });
		},

		delete$: <T>(commonDocumentType: DraftType, responseId: number): Observable<T> => {
			const url = `${this.config.api.root}/draft/response/delete/${commonDocumentType}/${responseId}`;
			return this.http.delete<T>(url, { withCredentials: true });
		},

		updateBLRWBR: (commonDocumentType: DraftType, ewaybillReponse: Ewaybill): Observable<Ewaybill> => {
			const url = `${this.config.api.root}/draft/response/updateBLRWBR`;
			return this.http.post<EwaybillResponse>(url, ewaybillReponse, { withCredentials: true });
		},

		updateBLRDNR: (commonDocumentType: DraftType, ewaybillReponse: Ewaybill): Observable<Ewaybill> => {
			const url = `${this.config.api.root}/draft/response/updateBLRDNR`;
			return this.http.post<EwaybillResponse>(url, ewaybillReponse, { withCredentials: true });
		},
	};

	public saveSignedCancel = {
		post$: (id: string, messageType: MessageType, signedXml: string): Observable<void> => {
			const url = `${this.config.api.root}/draft/saveSignedCancel/${messageType}`;
			return this.http.post<void>(url, {
				id,
				xmlBody: signedXml
			}, { withCredentials: true });
		}
	};

	public blrapn = {
		create2750ByEinvoice: {
			post$: (blrapnDraft: { documentId: number; changeReason: string }): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EINVOICE/create2750ByEinvoice`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, blrapnDraft, { withCredentials: true });
			}
		},
		saveSigned2750ByEinvoice: {
			post$: (signBlrapnDraft: { blrapnDraftId: number; xml: string }): Observable<any> => {
				const url = `${this.config.api.root}/draft/blrapn/EINVOICE/saveSigned2750ByEinvoice`;
				return this.http.post<any>(url, signBlrapnDraft, { withCredentials: true });
			}
		},

		create2650OnEinvoiceCancel: {
			post$: (documentId: number): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EINVOICE/create2650OnEinvoiceCancel`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, { documentId }, { withCredentials: true });
			}
		},
		saveSigned2650OnEinvoiceCancel: {
			post$: (blrapnDraftId: number, signedXml: string): Observable<any> => {
				const url = `${this.config.api.root}/draft/blrapn/EINVOICE/saveSigned2650OnEinvoiceCancel`;
				return this.http.post<any>(url, { blrapnDraftId, xml: signedXml }, { withCredentials: true });
			}
		},

		create2650OnEwaybillCancel: {
			post$: (documentId: number): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/create2650OnEwaybillCancel`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, { documentId }, { withCredentials: true });
			}
		},

		create2650OnResponse: {
			post$: (documentId: number): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/create2650OnResponse`;
				return this.http.post<any>(url, { documentId }, { withCredentials: true });
			}
		},

		create2651OnBlrapn2750: {
			post$: (documentId: number): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/create2651OnBlrapn2750`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, { documentId }, { withCredentials: true });
			}
		},
		saveSigned2650OnEwaybillCancelAndSendByActiveMq: {
			post$: (blrapnDraftId: number, signedXml: string): Observable<any> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/saveSigned2650OnEwaybillCancelAndSendByActiveMq`;
				return this.http.post<any>(url, { blrapnDraftId, xml: signedXml }, { withCredentials: true });
			}
		},

		create2750ByEwaybill: {
			post$: (blrapnDraft: { documentId: number; changeReason: string }): Observable<{ xml: string; blrapnDraftId: number }> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/create2750ByEwaybill`;
				return this.http.post<{ xml: string; blrapnDraftId: number }>(url, blrapnDraft, { withCredentials: true });
			}
		},
		saveSigned2750AndSendByActiveMq: {
			post$: (signBlrapnDraft: { blrapnDraftId: number; xml: string }): Observable<Ewaybill> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/saveSigned2750AndSendByActiveMq`;
				return this.http.post<Ewaybill>(url, signBlrapnDraft, { withCredentials: true });
			}
		},
		saveSigned2651OnBlrapn2750AndSendByActiveMq: {
			post$: (blrapnDraftId: number, signedXml: string): Observable<any> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/saveSigned2651OnBlrapn2750AndSendByActiveMq`;
				return this.http.post<any>(url, { blrapnDraftId, xml: signedXml }, { withCredentials: true });
			}
		},
		saveSigned2650OnResponseAndSendByActiveMq: {
			post$: (blrapnDraftId: number, signedXml: string): Observable<any> => {
				const url = `${this.config.api.root}/draft/blrapn/EWAYBILL/saveSigned2650OnResponseAndSendByActiveMq`;
				return this.http.post<any>(url, { blrapnDraftId, xml: signedXml }, { withCredentials: true });
			}
		},
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }

	public delete(draftType: DraftType, draftIds: number[]): Observable<number> {
		const url = `${this.config.api.root}/draft/delete/${draftType}`;
		const options = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
			}),
			body: draftIds,
			withCredentials: true
		};
		return this.http.delete<number>(url, options);
	}
}
