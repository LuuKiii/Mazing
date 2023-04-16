import { Action, ChangeAlgorithmAction, ChangeScreenModeAction, GridFillAction, Reducer } from "./state.interface";
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
        screenMode: (action as ChangeScreenModeAction).payload.changeTo
      }
    case 'GRID_FILL': 
      return {
        ...state,
        gridActions: {
          ...state.gridActions,
          ...(action as GridFillAction).payload
        }
      }
    default:
      return state;
  }
}
