import { Dimensions } from "../core/utils";
import { AvailableAlgorithms, FillGridWith, ScreenModes } from "./state";

type ActionTypes = 'CHANGE_SELECTED_ALGORITHM' | 'CHANGE_SCREEN_MODE' | 'GRID_FILL' | 'CHANGE_SCREEN_SIZE';

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

export interface GridFillAction extends Action {
  payload: {
    fillWith: FillGridWith
    isToCreateNew: boolean
  }
}

export interface ChangeScreenSizeWindowAction extends Action {
  payload: {
    windowSize: Dimensions
  }
}

//
//
//

export interface Reducer<T> {
  (state: T, action: Action): T;
}

export interface AppStateObserver {
  onAppStateChange(): void;
}
