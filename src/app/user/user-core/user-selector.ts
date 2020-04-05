import { Observable } from "rxjs";
import { createSelector, Store, select } from "@ngrx/store";
import { scanData } from "@helper/operators";
import { map } from "rxjs/operators";

export abstract class UserSelector<K> {

	constructor(protected readonly store: Store<K>) { }

	public select$<T>(fn: (state: K) => T): Observable<T> {
		const selector = createSelector(this.selectFn, fn);
		return this.store.pipe(
			select(selector)
		);
	}

	public selectDictionariesFromStore$<T>(view: (text: T) => string, fn: (state: K) => T[] | undefined): Observable<[T, string][]> {
		const selector = createSelector(this.selectFn, fn);
		return this.store.pipe(
			select(selector),
			scanData<T>(),
			map((obj): [T, string][] => obj ? obj.map((p): [T, string] => ([p, view(p)])) : []),
		);
	}

	protected abstract selectFn(appState: any): K;
}
