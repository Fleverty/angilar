import { Injectable, OnDestroy } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserPermissionService } from "@app/user/user-core/user-permission.service";
import { Observable, of, Subject } from "rxjs";
import { getEwaybillDocument } from "./ewaybill.actions";
import { EwaybillState } from "./ewaybill.reducer";
import { Store } from "@ngrx/store";
import { EwaybillSelectorService } from "./ewaybill-selector.service";
import { skip, take, takeUntil } from "rxjs/operators";
import { Ewaybill } from "@helper/abstraction/ewaybill";
import { HttpErrorResponse } from "@angular/common/http";
import { OverlayService } from "@core/overlay.service";

@Injectable()
export class EwaybillResolverService implements Resolve<Ewaybill | undefined>, OnDestroy {
	private unsubscribe$$ = new Subject<void>();
	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
		private readonly store: Store<EwaybillState>,
		private readonly overlayService: OverlayService,
	) { }

	public resolve(route: ActivatedRouteSnapshot): Observable<Ewaybill | undefined> {
		const type = route.paramMap.get("type");
		const id = route.paramMap.get("id");
		const trueMessagesType = this.userPermissionService.getDraftTypes("EWAYBILL");
		const docType = trueMessagesType.find(t => t === type) || null;
		const docId = id && Number.isFinite(+id) ? +id : null;

		if (!docType || !docId)
			return of(undefined);

		let action = getEwaybillDocument(docType, docId);
		if (route.data.action && typeof route.data.action === "function")
			action = route.data.action(docType, docId);

		this.store.dispatch(action);
		const errors$ = this.ewaybillSelectorService.select$((state: EwaybillState): HttpErrorResponse | Error | undefined => state.validationError);

		this.unsubscribe$$.next();
		errors$.pipe(
			skip(1),
			take(1),
			takeUntil(this.unsubscribe$$)
		).subscribe(err => {
			let m = "";
			if (err && err instanceof HttpErrorResponse)
				m = err.error && typeof err.error.error === "string" ? err.error.error : err.error.message;

			this.overlayService.showNotification$(m, "error");
		});

		return this.ewaybillSelectorService.select$(state => state.ewaybill).pipe(skip(1), take(1));
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
