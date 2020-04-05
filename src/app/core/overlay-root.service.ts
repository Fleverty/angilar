import { Injectable } from "@angular/core";

import { OverlayComponent } from "../shared/overlay/overlay.component";

@Injectable({
	providedIn: "root" // or 'root' for singleton
})
export class OverlayRootService {
	private component?: OverlayComponent;
	private errorMessage = "[ITERNAL] Root overlayComponent no initialise!";

	public init(component: OverlayComponent): void {
		this.component = component;
	}

	public getRootOverlayComponent(): OverlayComponent {
		if (!this.component) throw Error(this.errorMessage);
		return this.component;
	}
}
