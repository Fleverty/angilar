import { ComponentFactoryResolver, ComponentRef, Injectable, Type } from "@angular/core";

import { OverlayComponent } from "../shared/overlay/overlay.component";
import { OverlayRootService } from "./overlay-root.service";
import { NotificationComponent } from "@shared/notification/notification.component";

type OriginShowByFactory = OverlayComponent["showByFactory"];
type OriginShowNotification$ = OverlayComponent["showNotification$"];
type OriginShowConfirmation$ = OverlayComponent["showConfirmation$"];
// Возвращает тип параметров функции опуская первый параметр
type SkipFirstParametrs<T> = T extends (arg1: any, ...args: infer U) => any ? U : any;

@Injectable()
export class OverlayService {
	private component: OverlayComponent;

	constructor(
		private overlayRootService: OverlayRootService,
		private readonly componentFactoryResolver: ComponentFactoryResolver
	) {
		this.component = this.overlayRootService.getRootOverlayComponent();
	}

	public show<T>(component: Type<T>, ...args: SkipFirstParametrs<OriginShowByFactory>): ComponentRef<T> {
		const factory = this.componentFactoryResolver.resolveComponentFactory(component);
		return this.component.showByFactory(factory, ...args);
	}

	public showNotification$(...args: Parameters<OriginShowNotification$>): Promise<NotificationComponent> {
		return this.component.showNotification$(...args);
	}

	public showConfirmation$(...args: Parameters<OriginShowConfirmation$>): Promise<boolean> {
		return this.component.showConfirmation$(...args);
	}

	public clear(): void {
		return this.component.destroy();
	}
}
