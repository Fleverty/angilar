import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Store, createSelector, select } from "@ngrx/store";
import { UserState } from "./user.reducer";
import * as UserActions from "./user.actions";
import { take, filter } from "rxjs/operators";
import { UserPermissionService } from "./user-core/user-permission.service";
import { TemplateUtil } from "@helper/template-util";
import { DescriptionDocumentType, DocumentType } from "@helper/abstraction/documents";
import { UserRoutingService } from "@app/user/user-core/user-routing.service";
@Component({
	selector: "app-user",
	templateUrl: "./user.component.html",
	styleUrls: ["./user.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements AfterViewInit {
	@ViewChild("documentTypes", { static: true }) public documentTypes?: ElementRef<HTMLElement>;

	constructor(
		private readonly store: Store<UserState>,
		private readonly userPermissionService: UserPermissionService,
		private readonly userRoutingService: UserRoutingService
	) {
		this.userRoutingService.loadRouting();
		const selectUser = (appState: any): UserState => appState.user;
		const selectRoles = createSelector(selectUser, (state: UserState): UserState => state);

		this.store.pipe(
			select(selectRoles),
			take(1),
			filter(state => state.roles.length === 0 && !!state.token)
		).subscribe(() =>
			this.store.dispatch(UserActions.getRoles())
		);
	}

	public ngAfterViewInit(): void {
		if (!this.documentTypes)
			throw Error("No role implementation");
		const dts = TemplateUtil.getArray(this.documentTypes.nativeElement).map(dt => ({ id: dt[0] as DocumentType, name: dt[1] } as DescriptionDocumentType));
		this.userPermissionService.initDocumentTypes(dts);
	}
}
