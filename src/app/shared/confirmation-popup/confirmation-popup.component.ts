import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-confirmation-popup",
	templateUrl: "./confirmation-popup.component.html",
	styleUrls: ["./confirmation-popup.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationPopupComponent {
	@Input() public message?: string;
	@Input() public agreeButtonText?: string;
	@Input() public disagreeButtonText?: string;
	@Input() public withoutDisagree = false;
	@Output() public appComfirm = new EventEmitter<boolean>();
}
