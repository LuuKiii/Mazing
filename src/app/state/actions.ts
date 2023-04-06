import { Action, ChangeAlgorithmAction } from "./redux.interface";
import { AvailableAlgorithms } from "./state";

export class Actions {
  static changeSelectedAlgorithm(changeTo: AvailableAlgorithms): ChangeAlgorithmAction {
    return {
      type: 'CHANGE_SELECTED_ALGORITHM',
      payload: {
        changeTo: changeTo
      }
    }
  }
}
