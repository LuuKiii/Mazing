import { Dimensions } from "../core/utils";

export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
  screenMode: ScreenModes;
  windowSize: Dimensions;
  gridActions: GridState;
}

export type GridState = {
  fillWith: FillGridWith
  isToCreateNew: boolean
}

export type AvailableAlgorithms = 'Dijkstra' | 'AStar';
export type ScreenModes = 'Fullscreen' | 'Desktop-wrapped';
export type FillGridWith = 'EMPTY' | 'WALL'

export const initalState: AppState = {
  selectedAlgorithm: 'Dijkstra',
  screenMode: 'Desktop-wrapped',
  windowSize: {
    height: window.innerHeight,
    width: window.innerWidth,
  },
  gridActions: {
    fillWith: 'EMPTY',
    isToCreateNew: false,
  }
}
