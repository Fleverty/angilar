import { ValidationErrors, ValidatorFn, AbstractControl, FormGroup, FormArray } from "@angular/forms";
import { EventEmitter } from "@angular/core";

export class ValidatorsUtil {
	public static numberRegExp = /[0-9]/;
	public static lowercaseLatinCharacterRegExp = /[a-z]/;
	public static uppercaseLatinCharacterRegExp = /[A-Z]/;
	public static nonASCIICharacterRegExp = /[^\u0000-\u007F]+/;
	public static scSpecialCharacterRexExp = /[!@#$%^&*()]/;


	public static doNotMatch(firstField: string, secondField: string): ValidatorFn {
		return (form: AbstractControl): ValidationErrors | null => {
			const firstControl = form.get(firstField);
			const secondControl = form.get(secondField);
			if (firstControl && secondControl && firstControl.value !== secondControl.value)
				return { doNotMatch: true };
			else
				return null;
		};
	}

	public static nonRepeatingCharacters(characters: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value)
				return null;

			const newStr = control.value.replace(/(.)(?=.*?\1)/g, "");
			if (newStr.length >= characters)
				return null;
			else
				return { repeating: true };
		};
	}

	public static checkSumGLN(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value)
				return null;

			const s = control.value as string;
			if (s == null || !Number.isInteger(+s) || s.length < 2) {
				return { notGLN: true };
			}
			const calculated = ValidatorsUtil.checksum(s.slice(0, s.length - 1));
			const actual = s.charAt(s.length - 1);

			return actual == calculated ? null : { notGLN: true };
		};
	}

	public static checkSumGTIN(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}
			if (!(control.value.length >= 8 && control.value.length <= 14)) {
				return { notGTIN: true };
			}

			const checkDigit: string = (control.value as string)[control.value.length - 1];
			const withoutCheckDigit: string = (control.value as string).substring(0, (control.value as string).length - 1);
			const isCorrectGTIN: boolean = checkDigit === this.calculateCheckDigit(withoutCheckDigit);

			return isCorrectGTIN ? null : { notGTIN: true };
		};
	}

	public static onlyLatinOrSpecialCharactersAllowed(): ValidatorFn {
		return (control: AbstractControl): ValidatorsUtil | null => {
			if (!control.value)
				return null;

			return this.nonASCIICharacterRegExp.test(control.value) ? { onlyLatinOrSpecialCharactersAllowed: true } : null;
		};
	}

	public static noOneSpecialCharacters(): ValidatorFn {
		return (control: AbstractControl): ValidatorsUtil | null => {
			if (!control.value)
				return null;
			return this.scSpecialCharacterRexExp.test(control.value) ? null : { noOneSpecialCharacters: true };
		};
	}

	public static noOneNumberCharacters(): ValidatorFn {
		return (control: AbstractControl): ValidatorsUtil | null => {
			if (!control.value)
				return null;
			return this.numberRegExp.test(control.value) ? null : { noOnNumberCharacters: true };
		};
	}

	public static noOneLowercaseLatinCharacters(): ValidatorFn {
		return (control: AbstractControl): ValidatorsUtil | null => {
			if (!control.value)
				return null;
			return this.lowercaseLatinCharacterRegExp.test(control.value) ? null : { noOneLowercaseLatinCharacters: true };
		};
	}



	public static noOneUppercaseLatinCharacters(): ValidatorFn {
		return (control: AbstractControl): ValidatorsUtil | null => {
			if (!control.value)
				return null;
			return this.uppercaseLatinCharacterRegExp.test(control.value) ? null : { noOneUppercaseLatinCharacters: true };
		};
	}


	public static triggerValidation(control: AbstractControl): void {
		if (control instanceof FormGroup) {
			const group = (control as FormGroup);

			for (const field in group.controls) {
				const c = group.controls[field];

				this.triggerValidation(c);
			}
		}
		else if (control instanceof FormArray) {
			const group = (control as FormArray);

			for (const field in group.controls) {
				const c = group.controls[field];

				this.triggerValidation(c);
			}
		}

		control.markAsTouched({ onlySelf: true });
		(control.statusChanges as EventEmitter<any>).emit();
	}

	private static calculateCheckDigit(str: string): string {
		let sum = 0;
		let mult = 1;
		for (const i of str) {
			sum += mult * +i;
			mult = mult === 3 ? 1 : 3;
		}
		const controlNumber = sum % 10;
		return controlNumber !== 0 ? `${10 - controlNumber}` : "0";
	}

	private static checksum(s: string): string {
		let sum = 0;
		for (let i = 0, position = s.length; i < s.length; i++ , position--) {
			const n = +s.charAt(i);
			sum += n + (n + n) * (position & 1);
		}
		return `${(10 - (sum % 10)) % 10}`;
	}
}

