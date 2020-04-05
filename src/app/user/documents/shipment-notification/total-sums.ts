import { TotalSums as ITotalSums, ShipmentNotificationProduct } from "@helper/abstraction/shipment-notification";
import { Big } from "big.js";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type TotalSumsKeys = keyof Omit<ITotalSums, "isAutoSum">;

export class TotalSums implements ITotalSums {
	public quantityDespatch: string;
	public quantityDespatchLu: string;
	public amountWithoutVat: string;
	public amountVat: string;
	public amountWithVat: string;
	public grossWeight: string;
	public isAutoSum: boolean;

	constructor(initValue?: ITotalSums) {
		this.amountVat = initValue && initValue.amountVat || "0";
		this.amountWithoutVat = initValue && initValue.amountWithoutVat || "0";
		this.amountWithVat = initValue && initValue.amountWithVat || "0";
		this.quantityDespatch = initValue && initValue.quantityDespatch || "0";
		this.quantityDespatchLu = initValue && initValue.quantityDespatchLu || "0";
		this.grossWeight = initValue && initValue.grossWeight || "0";
		this.isAutoSum = initValue && initValue.isAutoSum || true;
	}

	public calculate(products: ShipmentNotificationProduct[]): TotalSums {
		const newSums = new TotalSums();
		Object.keys(newSums).forEach((key: string) => {
			newSums[key as TotalSumsKeys] = products.reduce((acc, curr) => (new Big(acc)).plus(new Big(curr[key as TotalSumsKeys] || 0)), new Big(0)).round(2).toString();
		});
		return newSums;
	}
}
