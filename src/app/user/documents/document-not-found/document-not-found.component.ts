import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";

@Component({
	selector: "app-document-not-found",
	templateUrl: "./document-not-found.component.html",
	styleUrls: ["./document-not-found.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentNotFoundComponent {

	constructor(
		private router: Router,
		private readonly userRoutingService: UserRoutingService
	) { }

	public goBack(): void {
		this.userRoutingService.navigateBack();
	}

	public goToMainPage(): void {
		this.router.navigate(["user", "documents"]);
	}
}
