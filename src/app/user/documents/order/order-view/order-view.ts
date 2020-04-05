import { ActivatedRoute } from "@angular/router";
import { DraftType } from "@helper/abstraction/draft";
import { OrderParams, OrderKind } from "@helper/abstraction/order";
import { OrdersState } from "@app/user/documents/order/orders.reducer";
import { Store } from "@ngrx/store";
import { exportXMLDocuments, exportXLSXDocuments } from "@app/user/user.actions";

export class OrderView {

	public get order(): OrderParams {
		return this.activatedRoute.snapshot.data.document;
	}

	public get code(): OrderKind {
		return this.activatedRoute.snapshot.params.code;
	}

	public get type(): DraftType {
		return this.activatedRoute.snapshot.params.type;
	}

	public get id(): string {
		return this.activatedRoute.snapshot.params.id;
	}

	constructor(
		protected readonly activatedRoute: ActivatedRoute,
		protected readonly store: Store<OrdersState>,
	) { }

	public exportXML(): void {
		this.store.dispatch(exportXMLDocuments({
			documentType: this.type,
			documentIds: [+this.id]
		}));
	}

	public exportXSLX(): void {
		this.store.dispatch(exportXLSXDocuments({
			documentType: "ORDERS",
			documentIds: [+this.id]
		}));
	}
}
