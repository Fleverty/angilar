export class TimeUtil {
	private static readonly msDay = 1000 * 60 * 60 * 24;
	public static daysDifferent(from: Date | string | undefined, to = new Date()): number {
		if (!from)
			return 0;
		if (!(from instanceof Date))
			from = new Date(from);
		return Math.abs(+from - +to / this.msDay);
	}
}
