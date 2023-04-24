import { GridActionsType } from "../core/grid-handler";
import { TilePointAllTypes } from "../core/tile";
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

//
//
// GRID ACTIONS

export interface GridAction extends Action {
  payload: {
    type: GridActionsType,
    data?: {
      [key: string]: any
    }
  }
}

export interface GridClearAction extends GridAction {
  payload: {
    type: 'CLEAR',
    data: undefined
  }
}

export interface GridSetNextClickedTileAction extends GridAction {
  payload: {
    type: 'SET_NEXT_TILE_AS',
    data: {
      setTo: TilePointAllTypes
    }
  }
}

export interface GridNoneAction extends GridAction {
  payload: {
    type: 'NONE'
    data: undefined
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
