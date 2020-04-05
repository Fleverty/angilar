import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";

@Component({
	selector: "app-document-type",
	templateUrl: "./document-type.component.html",
	styleUrls: ["./document-type.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentTypeComponent {
	@HostBinding("class.active")
	@Input() public isActive = false;
	@Input() public newInboxDocuments?: number;
}
