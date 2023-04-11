import { reducer } from "./reducer";
import { Action, AppStateObserver, Reducer } from "./redux.interface";
import { AppState, initalState } from "./state";


//this app should have one store that servers one state object
export class Store {
  private static instance: Store;

  private _state: AppState;
  private _observers: AppStateObserver[] = [];

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
    this._observers.forEach((o: AppStateObserver) => o.onAppStateChange())
  }

  subscribe(observer: AppStateObserver): void {
    this._observers.push(observer);
  }

  unSubscribe(observer: AppStateObserver): void {
    this._observers = this._observers.filter(o => o !== observer);
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store(reducer, initalState);
    }
    return Store.instance;
  }
}
