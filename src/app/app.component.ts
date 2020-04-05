import { Subject } from "rxjs";

import {
	AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewEncapsulation, Injector
} from "@angular/core";

import { OverlayRootService } from "./core/overlay-root.service";
import { OverlayComponent } from "./shared/overlay/overlay.component";
import { VersionCheckService } from "@core/version-check.service";

@Component({
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "body",
	styleUrls: ["./app.component.scss"],
	templateUrl: "./app.component.html"
})
export class AppComponent implements OnDestroy, AfterViewInit {
	@ViewChild(OverlayComponent, { static: true }) public overlayComponent?: OverlayComponent;
	private unsubscribe$$ = new Subject<void>();

	constructor(private overlayRootService: OverlayRootService, private injector: Injector) { }

	public ngAfterViewInit(): void {
		if (!this.overlayComponent)
			throw Error("No overlayComponent");
		this.overlayRootService.init(this.overlayComponent);
		this.injector.get(VersionCheckService);
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}
}
