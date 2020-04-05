import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "@core/configuration.service";

import { Authentication } from "./api/authenticate";
import { Documents } from "./api/documents";
import { Storages } from "./api/storages";
import { Sections } from "./api/sections";
import { Organization } from "./api/organization";
import { Nsi } from "./api/nsi";
import { Signing } from "./api/signing";
import { User } from "./api/user";
import { FormatDocument } from "./api/format-document";
import { Draft } from "./api/draft";
import { Provider } from "./api/provider";
import { Statistic } from "./api/statistic";
import { Activemq } from "./api/activemq";
import { DraftResponse } from "./api/draft-response";
import { Export } from "./api/export";
import { Desadv } from "./api/desadv";
import { Einvoice } from "./api/einvoice";
import { Ewaybill } from "./api/ewaybill";
import { Order } from "./api/orders";
import { DocumentController } from "./api/document-controller";
import { DocumentType, DocumentKind } from "@helper/abstraction/documents";
import { Einvoicepmt } from "@app/user/user-core/api/einvoicepmt";
import { UserPermissionService } from "./user-permission.service";
import { Config } from "./api/config";
import { Import } from "./api/import";

@Injectable()
export class UserBackendService {
	public readonly activemq: Activemq;
	public readonly authenticate: Authentication;
	public readonly desadv: Desadv;
	public readonly documents: Documents;
	public readonly draft: Draft;
	public readonly provider: Provider;
	public readonly draftResponse: DraftResponse;
	public readonly einvoice: Einvoice;
	public readonly ewaybill: Ewaybill;
	public readonly export: Export;
	public readonly formatDocument: FormatDocument;
	public readonly nsi: Nsi;
	public readonly order: Order;
	public readonly organization: Organization;
	public readonly sections: Sections;
	public readonly signing: Signing;
	public readonly statistic: Statistic;
	public readonly storages: Storages;
	public readonly user: User;
	public readonly einvoicepmt: Einvoicepmt;
	public readonly config: Config;
	public readonly import: Import;

	constructor(
		configurationService: ConfigurationService,
		httpClient: HttpClient,
		userPermissionService: UserPermissionService
	) {
		this.authenticate = new Authentication(configurationService, httpClient);
		this.organization = new Organization(configurationService, httpClient);
		this.storages = new Storages(configurationService, httpClient);
		this.sections = new Sections(configurationService, httpClient);
		this.nsi = new Nsi(configurationService, httpClient);
		this.draft = new Draft(configurationService, httpClient);
		this.provider = new Provider(configurationService, httpClient);
		this.draftResponse = new DraftResponse(configurationService, httpClient);
		this.signing = new Signing(configurationService, httpClient);
		this.user = new User(configurationService, httpClient);
		this.formatDocument = new FormatDocument(configurationService, httpClient);
		this.statistic = new Statistic(configurationService, httpClient);
		this.activemq = new Activemq(configurationService, httpClient);
		this.export = new Export(configurationService, httpClient);
		this.ewaybill = new Ewaybill(configurationService, httpClient);
		this.einvoice = new Einvoice(configurationService, httpClient);
		this.desadv = new Desadv(configurationService, httpClient);
		this.order = new Order(configurationService, httpClient);
		this.documents = new Documents(configurationService, httpClient, this, userPermissionService);
		this.einvoicepmt = new Einvoicepmt(configurationService, httpClient);
		this.config = new Config(configurationService, httpClient);
		this.import = new Import(configurationService, httpClient);
	}

	public getController(type: DocumentType): DocumentController<DocumentKind> {
		switch (type) {
			case "DESADV":
				return this.desadv;
			case "EWAYBILL":
				return this.ewaybill;
			case "EINVOICE":
				return this.einvoice;
			case "ORDERS":
				return this.order;
			case "EINVOICEPMT":
				return this.einvoicepmt;
			default:
				throw Error(`Controller for ${type} doesn't exist`);
		}
	}
}
