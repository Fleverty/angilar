import { ChangeDetectionStrategy, Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { TemplateUtil } from "@helper/template-util";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-customization",
	templateUrl: "./customization.component.html",
	styleUrls: ["./customization.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomizationComponent implements AfterViewInit {
	@ViewChild("titel", { static: true, read: ElementRef }) public titelTemplate?: ElementRef;

	constructor(private readonly title: Title) { }

	public ngAfterViewInit(): void {
		if (this.titelTemplate) {
			const m = TemplateUtil.getMap(this.titelTemplate.nativeElement).get("titel");
			if (m)
				this.title.setTitle(m);
		}
	}
}
