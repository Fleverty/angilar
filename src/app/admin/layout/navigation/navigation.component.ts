import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent {
	public isMenuOpen = false;

	public switchMenuState(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}
}
