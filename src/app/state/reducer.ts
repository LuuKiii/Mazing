import { Action, ChangeAlgorithmAction, ChangeScreenModeAction, ChangeScreenSizeWindowAction, GridAction, Reducer } from "./state.interface";
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
      };

    case 'CHANGE_SCREEN_SIZE':
      return {
        ...state,
        windowSize: {
          ...state.windowSize,
          ...(action as ChangeScreenSizeWindowAction).payload.windowSize
        }
      }

    case 'GRID_ACTION':
      return {
        ...state,
        gridAction: {
          type: (action as GridAction).payload.type,
          data: (action as GridAction).payload.data,
        }
      };

    default:
      return state;
  }
}
