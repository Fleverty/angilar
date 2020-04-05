import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";

export type skinType =
	"dots"
	| "blue-action"
	| "simple"
	| "action"
	| "action-save"
	| "simple-cancel"
	| "simple-blue"
	| "simple-red"
	| "add-field"
	| "add-product"
	| "simple-gray"
	| "bold"
	| "no-shadow"
	| "bordered"
	| "delete"
	| undefined;

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-button[appSkin], button[appSkin], a[appSkin]",
	styleUrls: ["./skin.component.scss"],
	template: "<ng-content></ng-content>",
})
export class SkinComponent {
	private type?: string[];

	@Input("appSkin")
	public set buttonType(value: string | undefined) {
		if (value)
			this.type = value.split(" ");
	}

	@HostBinding("class.simple")
	public get isDefault(): boolean {
		return (this.type || []).indexOf("simple") !== -1;
	}

	@HostBinding("class.no-shadow")
	public get isNoShadow(): boolean {
		return (this.type || []).indexOf("no-shadow") !== -1;
	}

	@HostBinding("class.bold")
	public get isBold(): boolean {
		return (this.type || []).indexOf("bold") !== -1;
	}

	@HostBinding("class.bordered")
	public get isBordered(): boolean {
		return (this.type || []).indexOf("bordered") !== -1;
	}

	@HostBinding("class.action")
	public get isAction(): boolean {
		return (this.type || []).indexOf("action") !== -1;
	}

	@HostBinding("class.action-save")
	public get isActionSave(): boolean {
		return (this.type || []).indexOf("action-save") !== -1;
	}

	@HostBinding("class.simple-cancel")
	public get isDefaultCancel(): boolean {
		return (this.type || []).indexOf("simple-cancel") !== -1;
	}

	@HostBinding("class.simple-blue")
	public get isSimpleBlue(): boolean {
		return (this.type || []).indexOf("simple-blue") !== -1;
	}

	@HostBinding("class.blue-action")
	public get isBlueAction(): boolean {
		return (this.type || []).indexOf("blue-action") !== -1;
	}

	@HostBinding("class.dots")
	public get isDots(): boolean {
		return (this.type || []).indexOf("dots") !== -1;
	}

	@HostBinding("class.simple-red")
	public get isSimpleRed(): boolean {
		return (this.type || []).indexOf("simple-red") !== -1;
	}

	@HostBinding("class.add-field")
	public get isAddField(): boolean {
		return (this.type || []).indexOf("add-field") !== -1;
	}

	@HostBinding("class.delete")
	public get isDelete(): boolean {
		return (this.type || []).indexOf("delete") !== -1;
	}

	public get isAddProduct(): boolean {
		return (this.type || []).indexOf("add-product") !== -1;
	}

	@HostBinding("class.simple-gray")
	public get isSimpleGray(): boolean {
		return (this.type || []).indexOf("simple-gray") !== -1;
	}
}
