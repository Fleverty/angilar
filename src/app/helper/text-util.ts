export class TextUtil {
	public static toTwoSymbol(digit: number): string {
		return digit < 10 ? "0" + digit : digit.toString();
	}

	public static toFourSymbol(digit: number): string {
		return digit < 10 ? "000" + digit : digit < 100 ? "00" + digit : digit < 1000 ? "0" + digit : digit.toString();
	}
}
