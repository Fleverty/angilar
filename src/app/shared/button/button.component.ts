import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component, ElementRef,
	Input,
	ViewChild
} from "@angular/core";
import { skinType } from "@shared/skin/skin.component";

@Component({
	selector: "app-button",
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements AfterViewInit {
	@Input() public type: "button" | "menu" | "submit" | "reset" = "submit";
	@Input() public icon?: string;
	@Input() public skin: skinType;
	@Input() public set disabled(value: any) {
		this.isDisabled = value || value === "";
	}
	@ViewChild("button", { read: ElementRef, static: true }) public buttonElement?: ElementRef;
	public isDisabled = false;

	public ngAfterViewInit(): void {
		this.buttonElement && this.buttonElement.nativeElement.addEventListener("click", (event: Event) => {
			if (this.isDisabled)
				event.stopPropagation();
		});
	}

	public ngOnInit(): void {
		if (!this.icon) throw Error("No icon. You must use skin.component.");
	}
}
