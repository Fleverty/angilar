import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { Observable, of } from "rxjs";
import { EinvoiceState } from "../einvoice.reducer";
import { Store } from "@ngrx/store";
import { EinvoiceSelectorService } from "./einvoice-selector.service";
import { skip, take } from "rxjs/operators";
import { Einvoice } from "@helper/abstraction/einvoice";
import { getEinvoiceDocument } from "../einvoice-actions/einvoice-signed.actions";

@Injectable()
export class EinvoiceResolverService implements Resolve<Einvoice | undefined> {
	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
		private readonly store: Store<EinvoiceState>,
	) { }

	public resolve(route: ActivatedRouteSnapshot): Observable<Einvoice | undefined> {
		const id = route.paramMap.get("id");
		const docId = id && Number.isFinite(+id) ? +id : null;

		if (!docId)
			return of(undefined);

		let action = getEinvoiceDocument(docId);
		if (route.data.action && typeof route.data.action === "function")
			action = route.data.action(docId);

		this.store.dispatch(action);
		return this.einvoiceSelectorService.select$(state => state.einvoice).pipe(skip(1), take(1));
	}
}
