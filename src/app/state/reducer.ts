import { Action, ChangeAlgorithmAction, ChangeScreenMode, Reducer } from "./redux.interface";
import { AppState } from "./state";

export const reducer: Reducer<AppState> = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'CHANGE_SELECTED_ALGORITHM':
      return {
        ...state,
        selectedAlgorithm: (action as ChangeAlgorithmAction).payload.changeTo
      };
    case 'CHANGE_SCREEN_MODE':
      return {
        ...state,
        screenMode: (action as ChangeScreenMode).payload.changeTo
      }
    default:
      return state;
  }
}
