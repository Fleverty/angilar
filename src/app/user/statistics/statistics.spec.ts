import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";
import { CommonModule } from "@angular/common";
import { StatisticsComponent } from "@app/user/statistics/statistics.component";
import { StatisticsEwaybillFilterComponent } from "@app/user/statistics/statistics-ewaybill-filter/statistics-ewaybill-filter.component";
import { StatisticsGridComponent } from "@app/user/statistics/statistics-grid/statistics-grid.component";
import { By } from "@angular/platform-browser";

describe("StatisticsComponent", () => {
	let component: StatisticsComponent;
	let fixture: ComponentFixture<StatisticsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				CommonModule
			],
			declarations: [
				StatisticsComponent,
				StatisticsEwaybillFilterComponent,
				StatisticsGridComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(StatisticsComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render grid", () => {
		expect((): HTMLElement => fixture.debugElement.query(By.css("app-statistics-grid")).nativeElement).toBeDefined();
	});

	it("should open export drop-list", () => {
		const exportBtn = fixture.debugElement.query(By.css("header > div > div > app-button"));
		exportBtn.triggerEventHandler("click", null);
		expect(component.showExport).toBe(true);
	});
});
