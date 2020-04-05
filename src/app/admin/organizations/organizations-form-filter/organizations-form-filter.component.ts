import {ChangeDetectionStrategy, Component, EventEmitter, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-organizations-form-filter",
	templateUrl: "./organizations-form-filter.component.html",
	styleUrls: ["./organizations-form-filter.component.scss"]
})
export class OrganizationsFormFilterComponent {
	@Output() public filterChanged: EventEmitter<{}> = new EventEmitter<{}>();
	public form: FormGroup;
	constructor(private readonly fb: FormBuilder) {
		this.form = this.fb.group({
			companiesGroup: null,
			orgName: null,
			orgGLN: null,
			connectionType: null,
			isChecked: false
		});
	}
}
