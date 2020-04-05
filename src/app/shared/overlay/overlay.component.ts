import { Subject } from "rxjs";

import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactory,
	ComponentFactoryResolver, ComponentRef, HostBinding, Injector, OnChanges, OnDestroy,
	SimpleChange, SimpleChanges, Type, ViewChild, ViewContainerRef
} from "@angular/core";

import { NotificationComponent } from "../notification/notification.component";
import { ConfirmationPopupComponent } from "@shared/confirmation-popup/confirmation-popup.component";
import { takeUntil } from "rxjs/operators";

// Возвращает тип параметров функции опуская первый параметр
type SkipFirstParametrs<T> = T extends (arg1: any, ...args: infer U) => any ? U : any;

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: "app-overlay",
	styleUrls: ["./overlay.component.scss"],
	template: "<ng-template #anchor></ng-template>"
})
export class OverlayComponent implements OnDestroy {
	@HostBinding("class.center") public isCenter = false;
	@ViewChild("anchor", { read: ViewContainerRef, static: true }) private viewContainerRef?: ViewContainerRef;
	private unsubscribe$$ = new Subject<void>();

	constructor(
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		public readonly changeDetectorRef: ChangeDetectorRef
	) { }


	public show<T>(component: Type<T>, ...args: SkipFirstParametrs<OverlayComponent["showByFactory"]>): ComponentRef<T> {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		return this.showByFactory(componentFactory, ...args);
	}

	public showByFactory<T>(componentFactory: ComponentFactory<T>, configuration?: {
		inputs?: { [key: string]: any };
		centerPosition?: boolean;
		injector?: Injector;
	}): ComponentRef<T> {
		if (!this.viewContainerRef)
			throw Error("No viewContainerRef");

		this.isCenter = configuration ? !!configuration.centerPosition : false;
		this.viewContainerRef.clear();
		const componentRef = this.viewContainerRef.createComponent(componentFactory, 0, configuration && configuration.injector);
		if (configuration)
			this.setInputs(componentRef, configuration);

		this.changeDetectorRef.markForCheck();
		return componentRef;
	}

	public showNotification$(message: string, type: "error" | "warning" | "success"): Promise<NotificationComponent> {

		return new Promise<NotificationComponent>((resolve): void => {
			if (!this.viewContainerRef)
				throw Error("No viewContainerRef");

			this.isCenter = false;
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NotificationComponent);
			// this.viewContainerRef.clear();
			const index = this.viewContainerRef.length;
			const componentRef = this.viewContainerRef.createComponent(componentFactory);

			const subscription = componentRef.instance.close$.subscribe(() => this.viewContainerRef && this.viewContainerRef.remove(index));
			componentRef.onDestroy(() => subscription.unsubscribe());
			componentRef.instance.message = message;
			if (type)
				componentRef.instance.type = type;
			this.changeDetectorRef.markForCheck();
			resolve(componentRef.instance);
		});
	}

	public showConfirmation$(message: string, agreeButtonText?: string, disagreeButtonText?: string, withoutDisagree?: boolean): Promise<boolean> {
		return new Promise<boolean>((resolve): void => {
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationPopupComponent);
			const componentRef = this.showByFactory(componentFactory, {
				inputs: {
					message,
					agreeButtonText,
					disagreeButtonText,
					withoutDisagree
				},
				centerPosition: true
			});
			componentRef.instance.appComfirm.pipe(
				takeUntil(this.unsubscribe$$)
			).subscribe(isAgree => {
				if (!this.viewContainerRef)
					throw Error("No viewContainerRef");
				this.viewContainerRef.clear();
				resolve(isAgree);
			});
			this.changeDetectorRef.markForCheck();
		});
	}

	public destroy(): void {
		if (!this.viewContainerRef)
			throw Error("No viewContainerRef");
		this.viewContainerRef.clear();
		this.changeDetectorRef.markForCheck();
	}

	@HostBinding("style.display")
	public get display(): string | undefined {
		return this.viewContainerRef && this.viewContainerRef.length > 0 ? undefined : "none";
	}

	public ngOnDestroy(): void {
		this.unsubscribe$$.next();
		this.unsubscribe$$.complete();
	}

	private setInputs<T>(component: ComponentRef<T>, configuration: {
		inputs?: { [key: string]: any };
		injector?: Injector;
	}): void {
		if (configuration.inputs) {
			for (const key of Object.keys(configuration.inputs)) {
				(component.instance as any)[key] = configuration.inputs[key];
			}
			const onChanges = component.instance as any as OnChanges;
			if (onChanges.ngOnChanges) {
				const changes: SimpleChanges = {};
				for (const key of Object.keys(configuration.inputs)) {
					(onChanges as any)[key] = configuration.inputs[key];
					changes[key] = new SimpleChange(undefined, configuration.inputs[key], false);
				}
				onChanges.ngOnChanges(changes);
			}
		}
	}
}
