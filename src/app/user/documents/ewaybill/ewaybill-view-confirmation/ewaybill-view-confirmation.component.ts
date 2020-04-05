import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { createSelector, select, Store } from "@ngrx/store";
import { EwaybillState } from "../ewaybill.reducer";
import { getProviderConfirmation } from "../ewaybill.actions";
import { OperationsConfirmByProvider } from "@helper/abstraction/operations-confirm";
import { Observable } from "rxjs";
import { EwaybillSelectorService } from "../ewaybill-selector.service";
import { Organization } from "@helper/abstraction/organization";
import { UserState } from "@app/user/user.reducer";
import { Ewaybill } from "@helper/abstraction/ewaybill";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-ewaybill-view-confirmation",
	styleUrls: ["./ewaybill-view-confirmation.component.scss"],
	templateUrl: "./ewaybill-view-confirmation.component.html"
})

export class EwaybillViewConfirmationComponent {
	public operationsBlockOpened = false;
	public providerConfirmation$: Observable<OperationsConfirmByProvider | undefined>;
	public organizationInfo$: Observable<Organization | undefined>;
	public ewaybill$?: Observable<Ewaybill | undefined>;
	public get id(): string | null {
		return this.activatedRoute.snapshot.paramMap.get("id");
	}

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<EwaybillState>,
		private readonly ewaybillSelectorService: EwaybillSelectorService,
	) {
		if (!this.id)
			throw Error("No id!");

		this.store.dispatch(getProviderConfirmation(this.id));
		this.providerConfirmation$ = this.ewaybillSelectorService.select$((state: EwaybillState): OperationsConfirmByProvider | undefined => state.providerConfirmation);
		this.ewaybill$ = this.ewaybillSelectorService.select$((state: EwaybillState): Ewaybill | undefined => state.ewaybill);

		const selectUserState = (appState: any): UserState => appState.user;
		const selectOrganizationInfo = createSelector(selectUserState, (state: UserState): Organization | undefined => state.organizationInfo);
		this.organizationInfo$ = this.store.pipe(select(selectOrganizationInfo));
	}
}
