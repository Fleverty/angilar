export interface SectionList {
	text: string;
	children?: SectionList[];
	id: string
}

export interface HelpContent {
	id: string;
	value: string | null;
}

export interface ChangeUserPassword {
	newPassword: string;
	newPasswordReplay: string;
	previousPassword: string;
}
