import { reducer } from "./reducer";
import { Action, ListenerCallback, Reducer, UnsubscribeCallback } from "./redux.interface";
import { AppState, initalState } from "./state";


//this app should have one store that servers one state object
export class Store {
  private static instance: Store;

  private _state: AppState;
  private _listener: ListenerCallback[] = [];

  private constructor(
    private reducer: Reducer<AppState>,
    private initalState: AppState
  ) {
    this._state = initalState;
  }

  getState(): AppState {
    return this._state;
  }

  dispatch(action: Action): void {
    this._state = this.reducer(this._state, action);
    this._listener.forEach((listener: ListenerCallback) => listener())
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    this._listener.push(listener);
    return () => {
      this._listener = this._listener.filter(l => l !== listener);
    }
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store(reducer, initalState);
    }
    return Store.instance;
  }
}
