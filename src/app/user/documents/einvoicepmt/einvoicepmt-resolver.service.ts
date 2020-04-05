import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Injectable, OnDestroy } from "@angular/core";
import { EinvoicepmtDto } from "@helper/abstraction/einvoicepmt";
import { Observable, of, Subject } from "rxjs";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { createSelector, select, Store } from "@ngrx/store";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { getEinvoicepmtDocument } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.actions";
import { skip, take } from "rxjs/operators";

@Injectable()
export class EinvoicepmtResolverService implements Resolve<EinvoicepmtDto | undefined>, OnDestroy {
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly store: Store<EinvoicepmtState>
	) { }

	public resolve(route: ActivatedRouteSnapshot): Observable<EinvoicepmtDto | undefined> {
		const id = route.paramMap.get("id");
		const docType = "BLRPMT";
		const docId = id && Number.isFinite(+id) ? +id : null;

		if (!docId)
			return of(undefined);

		let action = getEinvoicepmtDocument(docType, docId);
		if (route.data.action && typeof route.data.action === "function")
			action = route.data.action(docType, docId);

		this.store.dispatch(action);
		this.unsubscribe$$.next();

		const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectEinvoicepmt = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): EinvoicepmtDto | undefined => state.einvoicepmt);

		return this.store.pipe(select(selectEinvoicepmt)).pipe(skip(1), take(1));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
