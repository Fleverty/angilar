import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable()
export class DownloadFileService {
	constructor(@Inject(DOCUMENT) private readonly document: Document) { }
	public download(file: Blob, fileName?: string, fileExtension?: string): void {
		const downloadLink = this.document.createElement("a");
		downloadLink.download = `${fileName || "Report"}.${fileExtension || "zip"}`;
		if (window)
			downloadLink.href = window.URL.createObjectURL(new Blob([file], {
				type: `application/${fileExtension}`
			}));
		this.document.body.appendChild(downloadLink);
		downloadLink.click();
		this.document.body.removeChild(downloadLink);
	}
}
