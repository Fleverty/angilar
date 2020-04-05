import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
	selector: "[appClickOutside]"
})
export class ClickOutsideDirective {
	@Output("appClickOutside")
	public clickOutside$ = new EventEmitter<MouseEvent>();
	private arm = false;

	constructor(private readonly elementRef: ElementRef) { }

	@HostListener("document:mousedown", ["$event"])
	@HostListener("document:touchstart", ["$event"])
	public mousedown(event: MouseEvent): void {
		if (!this.elementRef.nativeElement) {
			return;
		}

		this.arm = !this.elementRef.nativeElement.contains(event.target);
	}

	@HostListener("document:mouseup", ["$event"])
	@HostListener("document:touchend", ["$event"])
	public mouseup(event: MouseEvent): void {
		if (this.arm) {
			this.arm = false;
			this.clickOutside$.next(event);
		}
	}
}
