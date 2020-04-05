import { OperatorFunction } from "rxjs";
import { filter, scan } from "rxjs/operators";

export function notNull<T>(): OperatorFunction<T | undefined | null, NonNullable<T>> {
	return filter(f => !!f) as any;
}

//накапливает данные до первого undefined или null
// todo: test
export function scanData<T>(doingWhenDataRecived?: () => void): OperatorFunction<T[] | null | undefined, NonNullable<T[]>> {
	const isCallbackExist = typeof doingWhenDataRecived === "function";
	return scan((acc, curr): T[] => {
		if (!curr) {
			if (isCallbackExist)
				doingWhenDataRecived!(); // eslint-disable-line
			return [];
		} else if (!curr.length) {
			if (isCallbackExist && !!acc.length)
				doingWhenDataRecived!(); // eslint-disable-line
			return acc;
		} else {
			return [...acc, ...curr] as T[];
		}
	}, [] as T[]);
}
