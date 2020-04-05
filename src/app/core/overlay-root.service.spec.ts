/* tslint:disable:no-unused-variable */

import { inject, TestBed } from "@angular/core/testing";

import { IconComponent } from "../shared/icon/icon.component";
import { NotificationComponent } from "../shared/notification/notification.component";
import { OverlayRootService } from "./overlay-root.service";

describe("Service: OverlayRoot", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent, IconComponent],
			providers: [OverlayRootService]
		});
	});

	it("should initialised", inject([OverlayRootService], (service: OverlayRootService) => {
		expect(() => service.getRootOverlayComponent()).toThrowError();
	}));
});
