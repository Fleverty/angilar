export interface ErrorMessage {
	key: string;
	fieldNames: string[];
}
export class CustomizationErrorService {
	public errorMessages: Record<string, string[]> = {};

	public mapErrorMessage(error: ErrorMessage[]): Record<string, string[]> {
		this.errorMessages = {};
		error.map((message: ErrorMessage): void => {
			message.fieldNames.forEach((field: string) => {
				if (field in this.errorMessages) {
					this.errorMessages[field].push(message.key);
				} else
					this.errorMessages[field] = [`${message.key}`];
			});
		});
		return this.errorMessages;
	}
}
