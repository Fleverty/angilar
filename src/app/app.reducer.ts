import { createAction, ActionReducer } from "@ngrx/store";

export const resetStore = createAction("[App] Reset Store");

export function clearState(reducer: ActionReducer<any, any>): ActionReducer<any, any> {
	return function (state: any, action: any): any {
		if (resetStore.type === action.type) {
			state = undefined;
		}
		return reducer(state, action);
	};
}
