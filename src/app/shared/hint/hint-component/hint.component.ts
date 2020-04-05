import {
	AfterViewChecked,
	Component,
	ElementRef,
	Inject,
	Input, Renderer2,
	TemplateRef,
	ViewChild
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
	selector: "app-hint-dynamic",
	templateUrl: "./hint.component.html",
	styleUrls: ["./hint.component.scss"]
})
export class HelpHintDynamicComponent implements AfterViewChecked {
	@Input()
	public hint?: TemplateRef<HTMLElement>;
	@Input()
	public templateRef?: TemplateRef<HTMLElement>;
	@ViewChild("hintContainer", { read: ElementRef, static: false }) public hintContainer?: ElementRef<HTMLElement>;
	public hintState = false;

	constructor(
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly renderer: Renderer2
	) { }

	public switchState(): void {
		this.hintState = !this.hintState;
	}

	public ngAfterViewChecked(): void {
		if (this.document && this.hintContainer && this.hintContainer.nativeElement) {
			const elem = this.hintContainer.nativeElement;
			const rect = elem.getBoundingClientRect();

			if (rect.right > document.body.offsetWidth)
				this.renderer.addClass(this.hintContainer.nativeElement, "reversed");
		}
	}
}
