import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ButtonComponent } from "./button/button.component";
import { CheckboxComponent } from "./checkbox/checkbox.component";
import { ClickOutsideDirective } from "./click-outside/click-outside.directive";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { DateboxComponent } from "./datebox/datebox.component";
import { DecadePickerComponent } from "./decade-picker/decade-picker.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FormValueChangesDirective } from "./form-value-change/form-value-change.directive";
import { GridDrawerComponent } from "./grid-drawer/grid-drawer.component";
import { IconComponent } from "./icon/icon.component";
import { ListComponent } from "./list/list.component";
import { LogoComponent } from "./logo/logo.component";
import { MonthPickerComponent } from "./month-picker/month-picker.component";
import { MonthRangePicker } from "./month-range-picker/month-range-picker.component";
import { MultiSelectBoxComponent } from "./multiselect-box/multiselect-box.component";
import { MultiSelectComponent } from "./multiselect/multiselect.component";
import { NumberboxComponent } from "./numberbox/numberbox.component";
import { NotificationComponent } from "./notification/notification.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { PasswordboxComponent } from "./passwordbox/passwordbox.component";
import { RadioButtonListComponent } from "./radio-button-list/radio-button-list.component";
import { RangeDatePickerComponent } from "./range-date-picker/range-date-picker.component";
import { RangeboxComponent } from "./rangebox/rangebox.component";
import { SelectDateRangeComponent } from "./select-date-range/select-date-range.component";
import { SelectDateComponent } from "./select-date/select-date.component";
import { SelectboxComponent } from "./selectbox/selectbox.component";
import { SkinComponent } from "./skin/skin.component";
import { TabItemComponent } from "./tab-item/tab-item.component";
import { TabComponent } from "./tab/tab.component";
import { TextboxComponent } from "./textbox/textbox.component";
import { YearPickerComponent } from "./year-picker/year-picker.component";
import { DropListComponent } from "./drop-list/drop-list.component";
import { GridComponent } from "@shared/grid/grid.component";
import { HintDirective } from "@shared/hint/hint.directive";
import { HelpHintDynamicComponent } from "@shared/hint/hint-component/hint.component";
import { ConfirmationPopupComponent } from "./confirmation-popup/confirmation-popup.component";
import { SmartJoinPipe } from "@shared/smart-join/smart-join.pipe";
import { TimePickerComponent } from "./time-picker/time-picker.component";
import { PendingComponent } from "./pending/pending.component";
import { ScrollToFirstInvalidDirective } from "./scroll-to-first-invalid/srollToFirstIvalidDerictive.directive";
import { NativeElementToFormControlProviderDirective } from "./native-element-to-form-control-provider/native-element-to-form-control-provider.directive";
import { FieldNameToFormControlProviderDirective } from "./field-name-to-formControl-provider/field-name-to-formControl-provider.directive";
import { SelectBoxSelfFetchComponent } from "./select-box-self-fetch/select-box-self-fetch.component";
import { OptionalCustomFieldComponent } from "./optional-custom-field/optional-custom-field.component";
import { TextareaComponent } from "./textarea/textarea.component";
import { DragAndDropDirective } from "./drag-and-drop/drag-and-drop.directive";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		DragAndDropDirective,
		ClickOutsideDirective,
		DropListComponent,
		ButtonComponent,
		CheckboxComponent,
		DateboxComponent,
		FileUploadComponent,
		FormValueChangesDirective,
		IconComponent,
		LogoComponent,
		MultiSelectBoxComponent,
		MultiSelectComponent,
		NumberboxComponent,
		OverlayComponent,
		PasswordboxComponent,
		RadioButtonListComponent,
		RangeboxComponent,
		SelectboxComponent,
		SkinComponent,
		TabComponent,
		TabItemComponent,
		TextboxComponent,
		TextareaComponent,
		GridComponent,
		DatePickerComponent,
		TimePickerComponent,
		HintDirective,
		SmartJoinPipe,
		PendingComponent,
		FieldNameToFormControlProviderDirective,
		ScrollToFirstInvalidDirective,
		NativeElementToFormControlProviderDirective,
		SelectBoxSelfFetchComponent,
		OptionalCustomFieldComponent
	],
	declarations: [
		DragAndDropDirective,
		DropListComponent,
		ButtonComponent,
		CheckboxComponent,
		ClickOutsideDirective,
		DateboxComponent,
		DatePickerComponent,
		TimePickerComponent,
		DecadePickerComponent,
		FileUploadComponent,
		FormValueChangesDirective,
		GridDrawerComponent,
		IconComponent,
		ListComponent,
		LogoComponent,
		MonthPickerComponent,
		MonthRangePicker,
		MultiSelectBoxComponent,
		MultiSelectComponent,
		NotificationComponent,
		NumberboxComponent,
		OverlayComponent,
		SelectBoxSelfFetchComponent,
		PasswordboxComponent,
		RadioButtonListComponent,
		RangeboxComponent,
		RangeDatePickerComponent,
		SelectboxComponent,
		SelectDateComponent,
		SelectDateRangeComponent,
		SkinComponent,
		TabComponent,
		TabItemComponent,
		TextboxComponent,
		TextareaComponent,
		YearPickerComponent,
		GridComponent,
		ConfirmationPopupComponent,
		HintDirective,
		HelpHintDynamicComponent,
		SmartJoinPipe,
		PendingComponent,
		ScrollToFirstInvalidDirective,
		NativeElementToFormControlProviderDirective,
		FieldNameToFormControlProviderDirective,
		SelectBoxSelfFetchComponent,
		OptionalCustomFieldComponent
	],
	entryComponents: [
		NotificationComponent,
		ConfirmationPopupComponent,
		NotificationComponent,
		HelpHintDynamicComponent
	]
})
export class SharedModule { }
