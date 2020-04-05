import { Injectable } from "@angular/core";
import { UserState } from "@app/user/user.reducer";
import { Store, createSelector } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { documentState } from "@helper/paths";
import { notNull } from "@helper/operators";

@Injectable()
export class OrderViewService {
	constructor(private store: Store<UserState>) { }

	public getDocumentViewType$(supplierGLN: string, status: documentState.incoming | documentState.outgoing): Observable<"ORDERS" | "ORDRSP"> {
		return this.isSeller$(supplierGLN).pipe(
			map((isSeller) => {
				if (isSeller) {
					return status === documentState.incoming ? "ORDERS" : "ORDRSP";
				} else {
					return status === documentState.incoming ? "ORDRSP" : "ORDERS";
				}
			})
		);
	}

	public isSeller$(supplierGLN: string): Observable<boolean> {
		return this.store.select(
			createSelector(
				(appState: any): UserState => appState.user,
				(state: UserState): string | undefined => state.organizationInfo && state.organizationInfo.gln
			)
		).pipe(
			notNull(),
			take(1),
			map(organizationGLN => organizationGLN === supplierGLN)
		);
	}
}
