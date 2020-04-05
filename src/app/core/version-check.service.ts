import { Injectable, Inject } from "@angular/core";
import { Observable, interval, Subscription } from "rxjs";
import { BackendService } from "./backend.service";
import { OverlayService } from "./overlay.service";
import { exhaustMap, startWith } from "rxjs/operators";
import { getVersion, getBuildMode } from "../../runtime/constants";
import { TranslationService } from "./translation.service";

@Injectable()
export class VersionCheckService {
	private subscription: Subscription;

	constructor(
		@Inject("Window") private readonly window: Window,
		private readonly backendService: BackendService,
		private readonly overlayService: OverlayService,
		private readonly translationService: TranslationService
	) {
		// use setInterval inside
		this.subscription = interval(600000).pipe(
			startWith(0),
			exhaustMap(() => this.getAppVersion$()),
		).subscribe(version => this.checkForUpdate(version.trim()));
	}

	public getAppVersion$(): Observable<string> {
		return this.backendService.version.get$();
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public checkForUpdate(serverVersion: string): void {
		if (!this.isCompareWithCurrentVersion(serverVersion)) {
			this.overlayService.showConfirmation$(this.translationService.getTranslation("versionDeprecated"), "", "", true).then(() => {
				if (this.window && this.window.location instanceof Location) {
					this.window.location.reload(true);
				}
			});
		}
	}

	public isCompareWithCurrentVersion(serverVersion: string): boolean {
		if (getBuildMode() === "development")
			return true;
		return serverVersion === getVersion();
	}
}
