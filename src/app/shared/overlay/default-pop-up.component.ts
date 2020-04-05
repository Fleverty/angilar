import { Subject } from "rxjs";
export class DefaultPopupComponent {
	public close$: Subject<void> = new Subject<void>();

	public close(): void {
		this.close$.next();
	}
}
