import { Observable } from "rxjs";
import { ConfigurationService } from "@core/configuration.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CurrenciesParams, CurrenciesDto } from "@helper/abstraction/currency";
import { GeneralGLNsParams, GeneralGLNsDto } from "@helper/abstraction/generalGLN";
import { ExtraFieldsParams, ExtraFieldsDto, ProductExtraFieldsParams, ProductExtraFieldDto } from "@helper/abstraction/extra-fields";
import { UnitOfMeasuresParams, UnitOfMeasureDto } from "@helper/abstraction/unit-of-measures";
import { CountriesParams, CountryDto } from "@helper/abstraction/countries";
import { CertificatesDto, CertificateParams } from "@helper/abstraction/certificate";
import { RegionDto, RegionsParams } from "@helper/abstraction/regions";
import { StreetDto, StreetsParams } from "@helper/abstraction/streets";
import { DocumentType } from "@helper/abstraction/documents";

export class Nsi {
	public currencies = {
		list: {
			get$: (cp: CurrenciesParams): Observable<CurrenciesDto> => {
				const url = `${this.config.api.root}/nsi/currencies/list`;
				let params = new HttpParams();
				params = params.set("page", cp.page.toString());
				params = params.set("size", cp.size.toString());

				if (cp.searchText) {
					params = params.set("currencyName", cp.searchText);
				}

				return this.http.get<CurrenciesDto>(url, { params, withCredentials: true });
			},
		}
	};

	public generalGLN = {
		list: {
			get$: (gp: GeneralGLNsParams): Observable<GeneralGLNsDto> => {
				const url = `${this.config.api.root}/nsi/general-gln/list`;
				let params = new HttpParams();
				params = params.set("page", gp.page.toString());
				params = params.set("size", gp.size.toString());

				if (gp.searchText) {
					params = params.set("glnName", gp.searchText);
				}

				return this.http.get<GeneralGLNsDto>(url, { params, withCredentials: true });
			},
		}
	};

	public extraFields = {
		list: {
			get$: (exp: ExtraFieldsParams): Observable<ExtraFieldsDto> => {
				const url = `${this.config.api.root}/nsi/extra-fields/list`;
				let params = new HttpParams();
				params = params.set("page", exp.page.toString());
				params = params.set("size", exp.size.toString());

				if (exp.searchText) {
					params = params.set("extraFieldName", exp.searchText);
				}

				return this.http.get<ExtraFieldsDto>(url, { params, withCredentials: true });
			}
		}
	};

	public consignees = {
		extraFields: {
			list: {
				get$: (exp: ExtraFieldsParams): Observable<ExtraFieldsDto> => {
					const url = `${this.config.api.root}/nsi/consignees/extra-fields/list`;
					let params = new HttpParams();
					params = params.set("page", exp.page.toString());
					params = params.set("size", exp.size.toString());

					if (exp.searchText) {
						params = params.set("extraFieldName", exp.searchText);
					}

					return this.http.get<ExtraFieldsDto>(url, { params, withCredentials: true });
				}
			}
		}
	};

	public uom = {
		list: {
			get$: (uomp: UnitOfMeasuresParams, documentType: DocumentType): Observable<UnitOfMeasureDto> => {
				const url = `${this.config.api.root}/nsi/uom/list`;
				let params = new HttpParams();
				params = params.set("page", uomp.page.toString());
				params = params.set("size", uomp.size.toString());
				params = params.set("documentType", documentType);

				if (uomp.searchText) {
					params = params.set("uomName", uomp.searchText);
				}

				return this.http.get<UnitOfMeasureDto>(url, { params, withCredentials: true });
			}
		}
	};

	public countries = {
		list: {
			get$: (cp: CountriesParams): Observable<CountryDto> => {
				const url = `${this.config.api.root}/nsi/countries/list`;
				let params = new HttpParams();
				params = params.set("page", cp.page.toString());
				params = params.set("size", cp.size.toString());

				if (cp.searchText) {
					params = params.set("countryName", cp.searchText);
				}

				return this.http.get<CountryDto>(url, { params, withCredentials: true });
			}
		}
	};

	public regions = {
		list: {
			get$: (rd: RegionsParams): Observable<RegionDto> => {
				const url = `${this.config.api.root}/nsi/regions/list`;
				let params = new HttpParams();
				params = params.set("page", rd.page.toString());
				params = params.set("size", rd.size.toString());

				if (rd.searchText) {
					params = params.set("regionName", rd.searchText);
				}

				return this.http.get<RegionDto>(url, { params, withCredentials: true });
			}
		}
	};

	public streets = {
		types: {
			list: {
				get$: (sp: StreetsParams): Observable<StreetDto> => {
					const url = `${this.config.api.root}/nsi/streets/types/list`;
					let params = new HttpParams();
					params = params.set("page", sp.page.toString());
					params = params.set("size", sp.size.toString());

					if (sp.searchText) {
						params = params.set("typeName", sp.searchText);
					}

					return this.http.get<StreetDto>(url, { params, withCredentials: true });
				}
			}
		}
	};

	public certificates = {
		types: {
			list: {
				get$: (dtp: CertificateParams): Observable<CertificatesDto> => {
					const url = `${this.config.api.root}/nsi/certificates/types/list`;
					let params = new HttpParams();
					params = params.set("page", dtp.page.toString());
					params = params.set("size", dtp.size.toString());

					if (dtp.searchText) {
						params = params.set("typeName", dtp.searchText);
					}

					return this.http.get<CertificatesDto>(url, { params, withCredentials: true });
				}
			}
		}
	};

	public item = {
		extraFields: {
			list: {
				get$: (pefp: ProductExtraFieldsParams): Observable<ProductExtraFieldDto> => {
					const url = `${this.config.api.root}/nsi/items/extra-fields/list`;
					let params = new HttpParams();
					params = params.set("page", pefp.page.toString());
					params = params.set("size", pefp.size.toString());

					if (pefp.searchText) {
						params = params.set("extraFieldName", pefp.searchText);
					}

					return this.http.get<ProductExtraFieldDto>(url, { params, withCredentials: true });
				}
			}
		}
	};

	constructor(private config: ConfigurationService, private http: HttpClient) { }
}
