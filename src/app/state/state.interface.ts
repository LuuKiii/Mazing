import { Dimensions } from "../core/utils";
import { AvailableAlgorithms, ScreenModes } from "./state";

type ActionTypes = 'CHANGE_SELECTED_ALGORITHM' | 'CHANGE_SCREEN_MODE' | 'CHANGE_SCREEN_SIZE' | 'GRID_ACTION';

export interface Action {
  type: ActionTypes;
  payload?: { [key: string]: any }
}

export interface ChangeAlgorithmAction extends Action {
  payload: {
    changeTo: AvailableAlgorithms
  }
}

export interface ChangeScreenModeAction extends Action {
  payload: {
    changeTo: ScreenModes
  }
}

export interface ChangeScreenSizeWindowAction extends Action {
  payload: {
    windowSize: Dimensions
  }
}

export interface Reducer<T> {
  (state: T, action: Action): T;
}

export interface AppStateObserver {
  onAppStateChange(): void;
}
