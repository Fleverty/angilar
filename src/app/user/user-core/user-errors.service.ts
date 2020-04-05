import { Injectable } from "@angular/core";
import { OverlayService } from "@core/overlay.service";
import { FormGroup, AbstractControl, FormControl, FormArray, ValidationErrors } from "@angular/forms";
import { TranslationService } from "@core/translation.service";

@Injectable()
export class UserErrorsService {
	constructor(
		private readonly overlayService: OverlayService,
		private readonly translateService: TranslationService
	) { }

	public displayErrors(form: FormGroup): void {
		const errors = this.getFormValidationErrors(form);
		if (errors.length) {
			const parsedErrors = errors.map((error: { [x: string]: AbstractControl & { controlName: string } }) => Object.keys(error)
				.map((fieldName: string) => Object.keys(error[fieldName].errors || {})
					.map((key: string) => {
						switch(key) {
							case "maxlength": {
								return `Значение поля ${error[fieldName].controlName || fieldName} должно быть не более ${((error[fieldName].errors || {})[key] || {})["requiredLength"] || ""} символов.`;
							}
							case "minlength": {
								return `Значение поля ${error[fieldName].controlName || fieldName} должно быть более ${((error[fieldName].errors || {})[key] || {})["requiredLength"] || ""} символов.`;
							}
							default: {
								return `${this.translateService.getTranslation(key)} "${error[fieldName].controlName || fieldName}".`;
							}
						}
					})));
			this.overlayService.showNotification$((parsedErrors || []).map(e => e.join("\n")).join("\n"), "error");
			return;
		}
	}

	public getFormValidationErrors(formGroup?: FormGroup | FormControl | FormArray, validationErrors?: { [x: string]: AbstractControl }[]): ValidationErrors[] {
		const errors: { [x: string]: AbstractControl }[] = validationErrors || [];
		if (formGroup && formGroup instanceof FormGroup)
			Object.keys(formGroup.controls).forEach(key => {
				const control = formGroup.get(key);
				const controlErrors: ValidationErrors | null = control ? control.errors : null;
				if (controlErrors != null) {
					Object.keys(controlErrors).forEach(() => {
						if (control)
							errors.push({ [key]: control });
					});
				}
				this.getFormValidationErrors(control as FormGroup | FormControl, errors);
			});
		if (formGroup && formGroup instanceof FormArray) {
			for (const key in formGroup.controls) {
				this.getFormValidationErrors((formGroup.controls as any)[key] as FormGroup | FormControl, errors);
			}
		}
		return errors;
	}
}
