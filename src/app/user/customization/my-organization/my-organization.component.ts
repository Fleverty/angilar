import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Store, createSelector, select } from "@ngrx/store";
import { CustomizationState } from "../customization.reducer";
import { Observable } from "rxjs";
import { saveOrganization } from "../customization.actions";
import { OverlayService } from "@core/overlay.service";
import { TemplateUtil } from "@helper/template-util";

@Component({
	selector: "app-my-organization",
	templateUrl: "./my-organization.component.html",
	styleUrls: ["./my-organization.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyOrganizationComponent {
	public persistent$: Observable<boolean | undefined>;
	private isFormValid: boolean | undefined = true;
	private texts: Map<string, string> = new Map<string, string>();

	@ViewChild("texts", { static: true, read: ElementRef }) private set textsTemplate(element: ElementRef) {
		this.texts = TemplateUtil.getMap(element.nativeElement);
	}

	constructor(
		private readonly store: Store<CustomizationState>,
		private readonly router: Router,
		private readonly overlayService: OverlayService
	) {
		const section = (appState: any): CustomizationState => appState.customization;
		const isChangeOrganizationInfo = createSelector(section, (state: CustomizationState): boolean | undefined => state.isChangeOrganizationInfo);
		const isOrganizationFormValid = createSelector(section, (state: CustomizationState): boolean | undefined => state.isOrganizationFormValid);
		this.persistent$ = this.store.pipe(select(isChangeOrganizationInfo));
		this.store.pipe(select(isOrganizationFormValid)).subscribe((valid: boolean | undefined) => {
			this.isFormValid = valid;
		});
	}

	public isActive(route: string): boolean {
		const routes = this.router.url.split("?")[0].split("/");
		return route === routes[routes.length - 1];
	}

	public saveOrganization(): void {
		if (this.isFormValid)
			this.store.dispatch(saveOrganization());
		else
			this.overlayService.showNotification$(this.texts.get("required") || "", "error");
	}
}
