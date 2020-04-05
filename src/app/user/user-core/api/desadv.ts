import { ConfigurationService } from "@core/configuration.service";
import { HttpClient } from "@angular/common/http";
import { ShipmentNotification } from "@helper/abstraction/shipment-notification";
import { DocumentController } from "./document-controller";

export class Desadv extends DocumentController<ShipmentNotification> {
	public get apiUrl(): string { return `${this.config.api.desadv}`; }

	constructor(
		private config: ConfigurationService,
		http: HttpClient
	) {
		super(http);
	}
}
