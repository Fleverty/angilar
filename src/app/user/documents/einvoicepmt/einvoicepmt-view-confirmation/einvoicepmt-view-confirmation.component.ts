import { Component, ChangeDetectionStrategy } from "@angular/core";
import { createSelector, select, Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";
import { EinvoicepmtState } from "@app/user/documents/einvoicepmt/einvoicepmt-store/einvoicepmt.reducer";
import { getProviderConfirmation } from "../einvoicepmt-store/einvoicepmt.actions";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoicepmt-view-confirmation",
	styleUrls: ["./einvoicepmt-view-confirmation.component.scss"],
	templateUrl: "./einvoicepmt-view-confirmation.component.html"
})

export class EinvoicepmtViewConfirmationComponent {
	public operationsBlockOpened = false;
	public providerConfirmation$: Observable<ProviderConfirmation | undefined>;
	public get id(): string | null {
		return this.activatedRoute.snapshot.paramMap.get("id");
	}
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<EinvoicepmtState>
	) {
		if (!this.id)
			throw Error("No id!");

		this.store.dispatch(getProviderConfirmation(this.id));

		const selectEinvoicepmtState = (appState: any): EinvoicepmtState => appState.einvoicepmt;
		const selectProviderConfirmation = createSelector(selectEinvoicepmtState, (state: EinvoicepmtState): ProviderConfirmation | undefined => state.providerConfirmation);
		this.providerConfirmation$ = this.store.pipe(select(selectProviderConfirmation));
	}
}
