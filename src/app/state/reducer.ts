import { Action, ChangeAlgorithmAction, Reducer } from "./redux.interface";
import { AppState } from "./state";

export const reducer: Reducer<AppState> = (state: AppState, action: Action): AppState => {
  switch(action.type) {
    case 'CHANGE_SELECTED_ALGORITHM':
      return {
        ...state,
        selectedAlgorithm: (action as ChangeAlgorithmAction).payload.changeTo
      };
    case 'DELETE':
      return state;
    default:
      return state;
  }
}
