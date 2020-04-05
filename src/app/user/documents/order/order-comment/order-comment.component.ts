import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-order-comment",
	templateUrl: "./order-comment.component.html",
	styleUrls: ["../form.scss", "./order-comment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCommentComponent {
	@Input() public form?: FormGroup;
}
