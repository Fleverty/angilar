import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store, createSelector } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserState } from "@app/user/user.reducer";
import { map } from "rxjs/operators";
import { documentState } from "@helper/paths";

@Component({
	selector: "app-order-header",
	template: `
		<ng-container *ngIf="(isSeller$ | async) as isSeller; else buyer" [ngSwitch]="status">
			<span *ngSwitchCase="documentStatePath.incoming" i18n>Заказ</span>
			<span *ngSwitchCase="documentStatePath.outgoing" i18n>Ответ на заказ</span>
		</ng-container>
		<ng-template #buyer>
			<ng-container [ngSwitch]="status">
				<span *ngSwitchCase="documentStatePath.incoming" i18n>Ответ на заказ</span>
				<span *ngSwitchCase="documentStatePath.outgoing" i18n>Заказ</span>
			</ng-container>
		</ng-template>
		`,
	styleUrls: ["./order-header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHeaderComponent {
	@Input() public supplierGLN?: string;
	@Input() public status?: documentState.incoming | documentState.outgoing;
	public documentStatePath = documentState;
	public isSeller$: Observable<boolean>;

	constructor(private store$: Store<UserState>) {
		this.isSeller$ = this.store$.select(
			createSelector(
				(appState: any): UserState => appState.user,
				(state: UserState): string | undefined => state.organizationInfo && state.organizationInfo.gln
			)
		).pipe(
			map(organizationGLN => organizationGLN === this.supplierGLN)
		);
	}
}
