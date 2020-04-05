import {
	ComponentFactoryResolver,
	Directive,
	Input,
	OnInit,
	TemplateRef,
	ViewContainerRef
} from "@angular/core";
import { HelpHintDynamicComponent } from "@shared/hint/hint-component/hint.component";

@Directive({
	selector: "[hint]"
})
export class HintDirective implements OnInit {
	@Input("hint") public hintTemplate?: TemplateRef<any>;
	private componentRef: any;

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private componentFactoryResolver: ComponentFactoryResolver
	) { }

	public ngOnInit(): void {
		if (!this.componentRef && this.hintTemplate) {
			this.viewContainer.clear();
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HelpHintDynamicComponent);
			this.componentRef = this.viewContainer.createComponent(componentFactory);
			this.componentRef.instance.templateRef = this.templateRef;
			this.componentRef.instance.hint = this.hintTemplate;
		} else {
			this.viewContainer.clear();
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}

	public ngOnDestroy(): void {
		if (this.componentRef) {
			this.componentRef.destroy();
		}
	}
}
