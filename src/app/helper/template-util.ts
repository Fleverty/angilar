export class TemplateUtil {
	public static getMap(templateElement: HTMLElement, templateId?: string): Map<any, any> {
		const dts = getDescriptionTerms(templateElement, templateId);
		return Array.from(dts).reduce((p, c): Map<any, any> => {
			const dd = c.nextElementSibling as HTMLElement;
			if (!dd || dd.tagName !== "DD") {
				throw new Error("Bad template.");
			}
			return p.set(getElementValue(c), getElementValue(dd));
		}, new Map<any, any>());
	}

	public static getArray(templateElement: HTMLElement, templateId?: string): [any, string][] {
		const dts = getDescriptionTerms(templateElement, templateId);
		return Array.from(dts).map((e): [any, any] => {
			const dd = e.nextElementSibling as HTMLElement;
			if (!dd || dd.tagName !== "DD") {
				throw new Error("Bad template.");
			}
			return [getElementValue(e), getElementValue(dd)];
		}) as [any, string];
	}


	public static getArrayWithAttributes(templateElement: HTMLElement, templateId?: string): [any, string][] {
		const dts = getDescriptionTerms(templateElement, templateId);
		return Array.from(dts).map((e): [any, any] => {
			const dd = e.nextElementSibling as HTMLElement;
			if (!dd || dd.tagName !== "DD") {
				throw new Error("Bad template.");
			}
			return [getElementValueWithAttribute(e), getElementValue(dd)];
		}) as [any, string];
	}

	public static getIsoDate(date: Date | undefined): string | undefined {
		return date && !isNaN(date.valueOf()) ? date.toISOString() : undefined;
	}

	public static getNestedStructure(templateElement: HTMLElement): any {
		const obj: any = {};
		const dts = getDescriptionTerms(templateElement);
		Array.from(dts).forEach(wrapDt => {
			parseInnerObject(wrapDt, obj);
		});
		return obj;
	}
}

function getElementValue(element: HTMLElement): any {
	if (element.hasAttribute("json")) {
		return JSON.parse(element.innerText.trim());
	}

	return element.innerText.trim();
}

function getElementValueWithAttribute(element: HTMLElement): any {
	return {
		attribute: element.attributes[1] ? element.attributes[1].nodeName : undefined,
		value: element.innerText.trim(), 
	};
}

function getDescriptionTerms(templateElement: HTMLElement, templateId?: string): NodeListOf<HTMLElement> {
	// eslint-disable-next-line
	const dl = templateId ? templateElement.querySelector(`dl#${templateId}`)! : templateElement.querySelector(":scope > dl")!;
	return dl.querySelectorAll(":scope > dt");
}

function parseInnerObject(elem: HTMLElement, obj: any): any {
	const wrapDd = elem.nextElementSibling as HTMLElement;
	const dtElements = getDescriptionTerms(wrapDd);
	const innerObj: any = {};
	obj[getElementValue(elem as HTMLElement)] = innerObj;
	[...dtElements].map(e => {
		if (e && e.nextElementSibling && e.nextElementSibling.querySelector("dl")) {
			innerObj[getElementValue(e)] = {};
			const parsed = parseInnerObject(e, innerObj[getElementValue(e)]);
			innerObj[getElementValue(e)] = [Object.keys(parsed).map(e => parsed[e])];
		}
		else
			innerObj[getElementValue(e)] = getElementValue(e.nextElementSibling as HTMLElement);
	});
	return obj;
}

