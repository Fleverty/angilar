import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { EinvoiceState } from "../einvoice.reducer";
import { getProviderConfirmation } from "../einvoice-actions/einvoice-main.actions";
import { ActivatedRoute } from "@angular/router";
import { EinvoiceSelectorService } from "../services/einvoice-selector.service";
import { Observable } from "rxjs";
import { ProviderConfirmation } from "@helper/abstraction/operations-confirm";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-einvoice-view-confirmation",
	styleUrls: ["./einvoice-view-confirmation.component.scss"],
	templateUrl: "./einvoice-view-confirmation.component.html"
})

export class EinvoiceViewConfirmationComponent {
	public operationsBlockOpened = false;
	public providerConfirmation$: Observable<ProviderConfirmation | undefined>;
	public get id(): string | null {
		return this.activatedRoute.snapshot.paramMap.get("id");
	}
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<EinvoiceState>,
		private readonly einvoiceSelectorService: EinvoiceSelectorService,
	) {
		if (!this.id)
			throw Error("No id!");

		this.store.dispatch(getProviderConfirmation(this.id));

		const selectFn$ = this.einvoiceSelectorService.select$.bind(this.einvoiceSelectorService);
		this.providerConfirmation$ = selectFn$(state => state.providerConfirmation);
	}
}
