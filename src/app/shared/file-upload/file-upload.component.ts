import { ChangeDetectionStrategy, Component, HostBinding, HostListener } from "@angular/core";

import { BoxValueAccessor } from "../box-value-accessor/BoxValueAccessor";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-file-upload",
	styleUrls: ["./file-upload.component.scss"],
	templateUrl: "./file-upload.component.html"
})

export class FileUploadComponent extends BoxValueAccessor {
	@HostBinding("class.isDragHover") public isDragHover = false;

	@HostListener("dragenter", ["$event"])
	@HostListener("dragover", ["$event"])
	public onDragOver(event: Event): void {
		const dt = (event as DragEvent).dataTransfer;
		if (dt && hasFile(dt.items)) {
			event.preventDefault();
			this.isDragHover = true;
		}
	}

	@HostListener("dragleave")
	public onDragLeave(): void {
		this.isDragHover = false;
	}

	@HostListener("drop", ["$event"])
	public onDrop(event: Event): void {
		event.preventDefault();
		this.isDragHover = false;
		const dt = (event as DragEvent).dataTransfer;
		if (dt)
			this.addFiles(dt.files);
		else
			throw Error("No dataTransfer!");
	}

	public addFiles(file: FileList): void {
		if (file.length > 0) {
			this.writeValue(file[0]);
		}
	}

	public sizeToString(value: number): string {
		return value.toString().length < 4 ? `${value} B` : value.toString().length < 7 ? `${Math.ceil(value / 1024)} kB` : `${Math.ceil(value / 1024 / 1024)} MB`;
	}
}

function hasFile(itemList: DataTransferItemList): boolean {
	for (const item of itemList as any as Iterable<DataTransferItem>) {
		if (item.kind === "file")
			return true;
	}
	return false;
}
