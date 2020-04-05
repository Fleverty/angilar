import { Observable, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	Document, DocumentProperty, DocumentsParams, DocumentState, DocumentType
} from "@helper/abstraction/documents";
import { createSelector, select, Store } from "@ngrx/store";

import { FormValue } from "../document-filter/document-filter.component";
import * as DocumentActions from "../documents.actions";
import { DocumentsState } from "../documents.reducer";
import { scanData, notNull } from "@helper/operators";
import { DocumentParamsService } from "../document-params.service";
import { DocumentsFilter } from "../document-filter/document-filter";
import { DocumentNavigator } from "./document-navigator";
import { DocumentEwaybillNavigator } from "./document-ewaybill-navigator";
import { DocumentShipmentNotificationNavigator } from "./document-shipment-notification-navigator";
import { DocumentOrdersNavigator } from "./document-orders-navigator";
import { DocumentDefaultNavigator } from "./document-default-navigator";
import { DocumentEinvoiceNavigator } from "./document-einvoice-navigator";
import { DocumentEinvoicepmtNavigator } from "@app/user/documents/document-list/document-einvoicepmt-navigator";
import { OverlayService } from "@core/overlay.service";
import { EwaybillMassSendReportPopupComponent } from "@app/user/documents/ewaybill/ewaybill-mass-send/ewaybill-mass-send-report-popup/ewaybill-mass-send-report-popup.component";

@Component({
	selector: "app-document-list",
	templateUrl: "./document-list.component.html",
	styleUrls: ["./document-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentListComponent implements OnDestroy {
	public lastFormValue: FormValue | null = null;
	public documentProperties$: Observable<DocumentProperty[]>; // свойства конкретного типа докумета
	public documentType: DocumentType;
	public documentState: "INCOMING" | "OUTGOING" | "DRAFT";
	public documents$: Observable<Document[]>;
	public selectedItems$: Observable<Document[] | undefined>;
	public unsubscribe$$ = new Subject<void>();
	public openedId$: Observable<number | undefined>;

	private size = 40;
	private page = 1;

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store<DocumentsState>,
		private readonly router: Router,
		private readonly documentParamsService: DocumentParamsService,
		private readonly overlayService: OverlayService
	) {
		const selectDocuments = (appState: any): DocumentsState => appState.documents;
		const selectDocumentTypes = createSelector(selectDocuments, (state: DocumentsState): Document[] | undefined => state.documents);
		const selectDocumentsFilter = createSelector(selectDocuments, (state: DocumentsState): DocumentsParams | undefined => state.filter);
		const selectCurrentDocumentTypeId = createSelector(selectDocuments, (state: DocumentsState): string | undefined => state.currentDocumentTypeId);
		const selectOpened = createSelector(selectDocuments, (state: DocumentsState): number | undefined => state.lastOpenedDocumentId);

		const documents$: Observable<Document[] | undefined> = this.store.pipe(select(selectDocumentTypes));

		this.documents$ = documents$.pipe(scanData<Document>());

		this.store.pipe(select(selectCurrentDocumentTypeId), notNull(), takeUntil(this.unsubscribe$$)).subscribe((currentDocumentTypeId: string) => {
			this.documentType = currentDocumentTypeId as DocumentType;
		});

		this.openedId$ = this.store.pipe(select(selectOpened));

		const selectProps = createSelector(selectDocuments, (state: DocumentsState): DocumentProperty[] => state.currentDocumentProperty);
		this.documentProperties$ = this.store.pipe(select(selectProps));

		const selectedItems = createSelector(selectDocuments, (state: DocumentsState): Document[] | undefined => state.selectedItems);
		this.selectedItems$ = this.store.pipe(select(selectedItems));

		const rightParent = this.activatedRoute.snapshot.parent;
		if (!rightParent || !rightParent.firstChild)
			throw Error("Can't get documentTypeId or actionTypeKey from route params");
		else {
			this.documentType = rightParent.params.documentTypeId;
			this.documentState = (rightParent.firstChild.params.actionTypeKey || "").toUpperCase();
		}

		// synchronize document state
		this.activatedRoute.params.pipe(
			takeUntil(this.unsubscribe$$)
		).subscribe(params => this.documentState = (params.actionTypeKey || "").toUpperCase());

		// преобразует фильтр к параметрам урл
		this.store.pipe(
			select(selectDocumentsFilter),
			notNull(),
			takeUntil(this.unsubscribe$$)
		).subscribe(filter => {
			const queryParams = this.documentParamsService.toParams(filter);
			this.router.navigate([], { queryParams, relativeTo: this.activatedRoute });
		});

		const selectMassSendReport = createSelector(selectDocuments, (state: DocumentsState) => state.massSendReport);
		this.store.pipe(select(selectMassSendReport)).pipe(notNull()).subscribe(report => {
			const massSendReportPopup = this.overlayService.show(EwaybillMassSendReportPopupComponent, { inputs: { report }, centerPosition: true });
			massSendReportPopup.instance.close$.pipe(take(1)).subscribe(() => {
				this.store.dispatch(DocumentActions.clearMassSendReport());
				massSendReportPopup.destroy();
			});
		});
	}

	public nextFormValue(value: FormValue | null, documentTypeId: DocumentType, documentState: DocumentState): void {
		if (value) {
			this.store.dispatch(DocumentActions.resetSelectedItems());
			this.store.dispatch(DocumentActions.resetDocuments());
			this.refresh(value, documentTypeId, documentState, 1, this.size);
		}
	}

	public refresh(form: FormValue, documentTypeId: DocumentType, documentState: DocumentState, page: number, size?: number): void {
		this.lastFormValue = form;
		this.page = page;
		this.size = size || this.size;
		this.documentState = documentState;

		this.store.dispatch(
			DocumentActions.updateDocumentsFilter(
				new DocumentsFilter({
					documentTypeId,
					documentStage: form.documentStage,
					documentState,
					documentDateEnd: new Date(+form.range[1]),
					documentDateStart: new Date(+form.range[0]),
					documentNumber: form.documentNumber,
					page,
					size,
					partnerId: form.partnerId,
					processingStatusId: form.processingStatusId,
					storageId: form.storageId
				})
			)
		);
	}

	public nextPage(): void {
		if (this.lastFormValue) {
			this.page += 1;
			this.refresh(this.lastFormValue, this.documentType, this.documentState, this.page);
		} else {
			throw Error("Can't do next page, when form === null.");
		}
	}

	public openDocument(doc: Document): void {
		this.store.dispatch(DocumentActions.setLastOpenedDocumentId(+doc.id));
		const navigator = this.getNavigator(this.documentType);
		navigator.navigate(this.documentState, doc);
	}

	public getNavigator(docType: DocumentType): DocumentNavigator {
		switch (docType) {
			case "EWAYBILL":
				return new DocumentEwaybillNavigator(this.router, this.store);
			case "ORDERS":
				return new DocumentOrdersNavigator(this.router);
			case "DESADV":
				return new DocumentShipmentNotificationNavigator(this.router);
			case "EINVOICE":
				return new DocumentEinvoiceNavigator(this.router);
			case "EINVOICEPMT":
				return new DocumentEinvoicepmtNavigator(this.router);
			default:
				return new DocumentDefaultNavigator(this.router);
		}
	}

	public actionSelectItems(selectItems: Document[]): void {
		if (selectItems.length > 0)
			this.store.dispatch(DocumentActions.pushSelectedItems(selectItems));
		else
			this.store.dispatch(DocumentActions.resetSelectedItems());
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
