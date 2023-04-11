import { Action, ChangeAlgorithmAction, ChangeScreenMode } from "./redux.interface";
import { AvailableAlgorithms, ScreenModes } from "./state";

export class Actions {
  static changeSelectedAlgorithm(changeTo: AvailableAlgorithms): ChangeAlgorithmAction {
    return {
      type: 'CHANGE_SELECTED_ALGORITHM',
      payload: {
        changeTo: changeTo
      }
    }
  }

  static changeCanvasSize(changeTo: ScreenModes): ChangeScreenMode {
    return {
      type: 'CHANGE_SCREEN_MODE',
      payload: {
        changeTo: changeTo
      }
    }
  }
}
