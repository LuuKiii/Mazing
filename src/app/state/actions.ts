import { ChangeAlgorithmAction, ChangeScreenModeAction, ChangeScreenSizeWindowAction } from "./state.interface";
import { AvailableAlgorithms, ScreenModes } from "./state";
import { Dimensions } from "../core/utils";
import { TilePointAllTypes } from "../core/grid/tile";
import { generateRandomID } from '../utils/functions';
import { GridSetNextClickedTileAction, GridClearAction } from './grid-actions.interface';

export class Actions {
  static changeSelectedAlgorithm(changeTo: AvailableAlgorithms): ChangeAlgorithmAction {
    return {
      type: 'CHANGE_SELECTED_ALGORITHM',
      payload: {
        changeTo: changeTo
      }
    }
  }

  static changeCanvasSize(changeTo: ScreenModes): ChangeScreenModeAction {
    return {
      type: 'CHANGE_SCREEN_MODE',
      payload: {
        changeTo: changeTo
      }
    }
  }

  static changeWindowSize(windowSize: Dimensions): ChangeScreenSizeWindowAction {
    return {
      type: 'CHANGE_SCREEN_SIZE',
      payload: {
        windowSize: {
          width: windowSize.width,
          height: windowSize.height
        }
      }
    }
  }

  //probably should seperate this to other reducer, but for now this will do
  static gridClearAction(): GridClearAction {
    return {
      type: 'GRID_ACTION',
      payload: {
        type: 'CLEAR',
        id: generateRandomID(),
        data: undefined
      }
    }
  }

  static gridSetNextClickedButtonAsAction(setTo: TilePointAllTypes): GridSetNextClickedTileAction {
    return {
      type: 'GRID_ACTION',
      payload: {
        type: 'SET_NEXT_TILE_AS',
        id: generateRandomID(),
        data: {
          setTo: setTo
        }
      }
    }
  }
}
