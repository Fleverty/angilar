import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GridComponent } from "@shared/grid/grid.component";
import { TranslationService } from "@core/translation.service";
import { Store } from "@ngrx/store";
import { DocumentsState } from "@app/user/documents/documents.reducer";
import { StatisticEwaybillDocument, StatisticOrdersDocument } from "@helper/abstraction/statistic";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-statistics-grid",
	templateUrl: "./statistics-grid.component.html",
	styleUrls: ["./statistics-grid.component.scss"]
})
export class StatisticsGridComponent extends GridComponent<StatisticEwaybillDocument | StatisticOrdersDocument> {
	public clickId?: number;

	constructor(
		private readonly translationService: TranslationService,
		store: Store<DocumentsState>,
	) {
		super(store);
	}

	public getStatuses(status: string): string {
		return this.translationService.getTranslation(status);
	}
}
