import { PlatformLocation } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class ConfigurationService {
	private readonly baseHref: string;
	private readonly signingPort = 7756;

	constructor(platformLocation: PlatformLocation) {
		this.baseHref = platformLocation.getBaseHrefFromDOM();
	}

	public get api(): { root: string; desadv: string; ewaybill: string; einvoice: string; order: string; user: string; einvoicepmt: string } {
		return {
			root: `${this.baseHref}api`,
			desadv: `${this.baseHref}api/DESADV`,
			ewaybill: `${this.baseHref}api/EWAYBILL`,
			einvoice: `${this.baseHref}api/EINVOICE`,
			einvoicepmt: `${this.baseHref}api/EINVOICEPMT`,
			order: `${this.baseHref}api/ORDERS`,
			user: `${this.baseHref}api/user`,
		};
	}

	public get signingService(): string {
		return `https://localhost:${this.signingPort}`;
	}
}
