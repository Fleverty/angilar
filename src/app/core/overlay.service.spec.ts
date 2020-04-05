import { TestBed } from "@angular/core/testing";

import { IconComponent } from "../shared/icon/icon.component";
import { NotificationComponent } from "../shared/notification/notification.component";
import { OverlayService } from "./overlay.service";

describe("Service: Overlay", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent, IconComponent],
			providers: [OverlayService]
		});
	});
});
