import { Subject } from "rxjs";

import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-notification",
	styleUrls: ["./notification.component.scss"],
	templateUrl: "./notification.component.html"
})

export class NotificationComponent {
	public close$ = new Subject<void>();
	@Input() public message?: string;
	@Input() public type: "error" | "warning" | "success" = "success";

	public getType(message: any): string {
		return typeof message;
	}

	@HostBinding("class.error")
	public get isError(): boolean { return this.type === "error"; }

	@HostBinding("class.warning")
	public get isWarning(): boolean { return this.type === "warning"; }

	@HostBinding("class.success")
	public get isSuccess(): boolean { return this.type === "success"; }
}

