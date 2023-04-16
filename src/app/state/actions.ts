import { Action, ChangeAlgorithmAction, ChangeScreenModeAction, GridFillAction } from "./state.interface";
import { AvailableAlgorithms, FillGridWith, ScreenModes } from "./state";

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

  static fillGridWith(fillGridWith: FillGridWith, isToCreateNew = false): GridFillAction {
    return {
      type: 'GRID_FILL',
      payload: {
        fillWith: fillGridWith,
        isToCreateNew: isToCreateNew
      }
    }
  }
}
