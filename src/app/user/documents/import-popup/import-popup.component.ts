import { DefaultPopupComponent } from "@shared/overlay/default-pop-up.component";
import { ChangeDetectionStrategy, Component, ViewChild, ElementRef } from "@angular/core";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";
import { Store } from "@ngrx/store";
import { DocumentsState } from "../documents.reducer";
import { importEinvoice } from "../documents.actions";

@Component({
	selector: "app-import-popup",
	templateUrl: "./import-popup.component.html",
	styleUrls: ["./import-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ImportPopupComponent extends DefaultPopupComponent {
	public file?: File;
	public size?: number;
	@ViewChild("texts", { static: true }) private texts?: ElementRef<HTMLTemplateElement>;

	private messages: Map<string, string> = new Map<string, string>();

	constructor(
		private overlayService: OverlayService,
		private readonly store: Store<DocumentsState>,
	) {
		super();
	}

	public import(file?: File): void {
		if (file)
			this.store.dispatch(importEinvoice({ documentType: "EWAYBILL", file: file }));
	}

	public checkFile(files: FileList): void {
		this.overlayService.clear();
		const message = this.getMessage(files || this.file);
		if (message) {
			this.overlayService.showNotification$(message, "error");
		} else {
			this.file = files[0];
			this.size = this.file && this.file.size / 1000000 || 0;
		}
	}

	public addFile(event: Event): void {
		const target = event.target || event.srcElement;
		this.checkFile((target as HTMLInputElement).files as FileList);
	}

	public fileDropped(files: FileList): void {
		this.checkFile(files);
	}

	public ngAfterViewInit(): void {
		if (!this.texts)
			throw Error("No texts");
		this.messages = TemplateUtil.getMap(this.texts.nativeElement);
	}

	private getMessage(file: FileList): string | undefined {
		let message: string | undefined = undefined;

		if (file.length !== 1) {
			message = this.messages.get("notOneFile");
			if (!message) throw Error("No message");
			return message;
		}
		if (file[0].type.indexOf("zip") === -1) {
			message = this.messages.get("noZip");
			if (!message) throw Error("No message");
			return message;
		}
		if (+file[0].size / 1000000 > 5) {
			message = this.messages.get("no5MB");
			if (!message) throw Error("No message");
			return message;
		}
		return message;
	}
}
