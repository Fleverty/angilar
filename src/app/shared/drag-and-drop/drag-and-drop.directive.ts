import { Directive, Output, EventEmitter, HostListener, HostBinding } from "@angular/core";

@Directive({
	selector: "[appDragAndDrop]",
})

export class DragAndDropDirective {
	@Output() public fileDropped = new EventEmitter<FileList>();
	@HostBinding("style.background") public background = "#fff";

	@HostListener("dragover", ["$event"])
	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.background = "#eee";
	}

	@HostListener("dragleave", ["$event"])
	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.background = "#fff";
	}

	@HostListener("drop", ["$event"])
	public onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const files = (event.dataTransfer as DataTransfer).files;
		if (files.length > 0) {
			this.fileDropped.emit(files);
			this.background = "#fff";
		}
	}
}
