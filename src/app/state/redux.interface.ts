import { AvailableAlgorithms } from "./state";

type ActionTypes = 'CHANGE_SELECTED_ALGORITHM' |'ADD' | 'DELETE' 

export interface Action {
  type: ActionTypes;
  payload?: {[key: string]: any}
}

export interface ChangeAlgorithmAction extends Action {
  payload: {
    changeTo: AvailableAlgorithms
  }
}

//
//
//

export interface Reducer<T> {
  (state: T, action: Action): T;
}

export interface ListenerCallback {
  (): void;
}

export interface UnsubscribeCallback {
  (): void;
}
