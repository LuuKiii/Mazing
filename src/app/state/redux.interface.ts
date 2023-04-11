import { AvailableAlgorithms, ScreenModes } from "./state";

type ActionTypes = 'CHANGE_SELECTED_ALGORITHM' | 'CHANGE_SCREEN_MODE';

export interface Action {
  type: ActionTypes;
  payload?: { [key: string]: any }
}

export interface ChangeAlgorithmAction extends Action {
  payload: {
    changeTo: AvailableAlgorithms
  }
}

export interface ChangeScreenMode extends Action {
  payload: {
    changeTo: ScreenModes
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
