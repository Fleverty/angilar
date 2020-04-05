import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "smartJoin"
})
export class SmartJoinPipe implements PipeTransform {
	public transform(value: any[], separator = ","): string {
		return value.filter((e: any) => !!e).join(`${separator} `);
	}
}
