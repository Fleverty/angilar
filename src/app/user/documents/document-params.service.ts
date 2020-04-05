import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { DocumentsParams } from "@helper/abstraction/documents";
import { DocumentsFilter } from "./document-filter/document-filter";

@Injectable()
export class DocumentParamsService {
	public fromParams(params: Params): DocumentsParams | null {
		// page and size default
		if (!(params.documentTypeId && params.stage && params.documentState))
			return null;

		const filter = new DocumentsFilter({
			documentTypeId: params.documentTypeId,
			documentStage: params.stage,
			documentState: params.documentState,
			documentDateEnd: new Date(+params.endDate),
			documentDateStart: new Date(+params.startDate),
			processingStatusId: params.status,
			documentNumber: params.documentNumber,
			partnerId: params.partner,
			storageId: params.storage
		});
		return filter;
	}

	public toParams(dp: DocumentsParams): Params {
		const params: Params = {};
		params.endDate = dp.documentDateEnd.valueOf().toString();
		params.startDate = dp.documentDateStart.valueOf().toString();
		params.stage = dp.documentStage;
		if (dp.processingStatusId)
			params.status = dp.processingStatusId;
		if (dp.partnerId)
			params.partner = dp.partnerId;
		if (dp.documentNumber)
			params.documentNumber = dp.documentNumber;
		if (dp.storageId)
			params.storage = dp.storageId;
		return params;
	}

	public normalize(dp: DocumentsParams): DocumentsParams {
		const newInstance = JSON.parse(JSON.stringify(dp));
		newInstance.startDate = new Date(newInstance.startDate);
		newInstance.endDate = new Date(newInstance.endDate);

		for (const prop in newInstance) {
			if (newInstance[prop] === undefined)
				delete newInstance[prop];
		}
		return newInstance;
	}
}
