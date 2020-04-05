import { inject, TestBed } from "@angular/core/testing";

import { PermissionService } from "./permission.service";

describe("Service: Permission", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PermissionService]
		});
	});

	it("should ...", inject([PermissionService], (service: PermissionService) => {
		expect(service).toBeTruthy();
	}));
});
