import { ComponentFactoryResolver, EmbeddedViewRef, Inject, Injector, Optional, Type, Injectable } from "@angular/core";
import { TemplateUtil } from "@helper/template-util";

@Injectable()
export class TranslationService {
	private map: Map<string, string>;
	constructor(
		componentFactoryResolver: ComponentFactoryResolver,
		injector: Injector,
		@Inject("TranslateComponent") @Optional() public translateComponent?: Type<{}>,
	) {
		if (!translateComponent)
			throw new Error("No translation component provide");

		const componentFactory = componentFactoryResolver.resolveComponentFactory(translateComponent);
		const componentRef = componentFactory.create(injector);
		const node = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0].firstElementChild;
		this.map = TemplateUtil.getMap(node);
		componentRef.destroy();
	}

	public getTranslation(key: string): string {
		return this.map.get(key) || "";
	}
}
