import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { StatisticsComponent } from "./statistics.component";
import { SharedModule } from "@shared/shared.module";
import { StatisticsEwaybillFilterComponent } from "@app/user/statistics/statistics-ewaybill-filter/statistics-ewaybill-filter.component";
import { StatisticsGridComponent } from "@app/user/statistics/statistics-grid/statistics-grid.component";
import { EffectsModule } from "@ngrx/effects";
import { StatisticEffects } from "./statistic.effects";
import { ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { reducer } from "./statistic.reducer";
import { StatisticSelectorService } from "./statistic-selector.service";
import { Route, RouterModule } from "@angular/router";
import { StatisticsOrdersFilterComponent } from "./statistics-orders-filter/statistics-orders-filter.component";
import { StatisticFilterFormBuilderService } from "./statistic-filter-form-builder.service";
import { StatusesTranslationComponent } from "./statuses-translation/statuses-translation.component";
import { TranslationService } from "@core/translation.service";
import { DownloadFileService } from "../documents/downloadFile.service";
import { StatisticFilterService } from "./statistic-filter.service";
import { CookieService } from "ngx-cookie-service";
import { StatisticCookieService } from "./statistic-cookie.service";

export const ROUTES: Route[] = [
	{
		path: "",
		component: StatisticsComponent,
		children: [
			{
				path: ":documentType",
			},
		]
	},
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		EffectsModule.forFeature([StatisticEffects]),
		ReactiveFormsModule,
		StoreModule.forFeature("statistics", reducer),
		RouterModule.forChild(ROUTES),
	],
	declarations: [
		StatisticsComponent,
		StatisticsEwaybillFilterComponent,
		StatisticsOrdersFilterComponent,
		StatisticsGridComponent,
		StatusesTranslationComponent
	],
	entryComponents: [
		StatusesTranslationComponent
	],
	providers: [
		StatisticSelectorService,
		StatisticFilterFormBuilderService,
		TranslationService,
		DownloadFileService,
		StatisticFilterService,
		{ provide: "TranslateComponent", useValue: StatusesTranslationComponent },
		CookieService,
		StatisticCookieService
	]
})
export class StatisticsModule { }
