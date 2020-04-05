/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimePickerComponent } from "./time-picker.component";

describe("TimePickerComponent", () => {
	let component: TimePickerComponent;
	let fixture: ComponentFixture<TimePickerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TimePickerComponent]
		})
			.compileComponents();
		fixture = TestBed.createComponent(TimePickerComponent);
		component = fixture.componentInstance;
		component.value = new Date();
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("Test startToCenter(i).", () => {
		it("i = 1, should 0", () => {
			expect(component.startToCenter(1)).toBe(0);
		});

		it("i = 10, should 6", () => {
			expect(component.startToCenter(10)).toBe(6);
		});
	});

	it("Test synchronise(13.11.2019, 12:06).Should type time string.", () => {
		component.synchronise(new Date(1573635986106));
		expect(component.time && component.time.nativeElement.value).toBe("12:06");
	});

	describe("Test onInputTime(time).", () => {
		it("time = 12:06", () => {
			component.onInputTime("12:06");
			expect(component.selectedTime).toEqual({ hours: 12, minutes: 30 });
			expect(component.time && component.time.nativeElement.value).toBe("12:06");
		});

		it("time = 12:00", () => {
			component.onInputTime("12:00");
			expect(component.selectedTime).toEqual({ hours: 12, minutes: 0 });
			expect(component.time && component.time.nativeElement.value).toBe("12:00");
		});

		it("time = 12:30", () => {
			component.onInputTime("12:30");
			expect(component.selectedTime).toEqual({ hours: 12, minutes: 30 });
			expect(component.time && component.time.nativeElement.value).toBe("12:30");
		});

		it("time = 23:33", () => {
			component.onInputTime("23:33");
			expect(component.selectedTime).toEqual({ hours: 0, minutes: 0 });
			expect(component.time && component.time.nativeElement.value).toBe("23:33");
		});
	});

	describe("Test setTime(time).", () => {
		it("time = 12:00", () => {
			component.onInputTime("12:00");
			expect(component.selectedTime).toEqual({ hours: 12, minutes: 0 });
			expect(component.time && component.time.nativeElement.value).toBe("12:00");
		});

		it("time = 12:30", () => {
			component.onInputTime("12:30");
			expect(component.selectedTime).toEqual({ hours: 12, minutes: 30 });
			expect(component.time && component.time.nativeElement.value).toBe("12:30");
		});
	});
});
