import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-users",
	templateUrl: "./users.component.html",
	styleUrls: ["./users.component.scss"]
})
export class UsersComponent { }
