import { GridActionsType } from "../core/grid-handler";
import { Dimensions } from "../core/utils";
import { GridAction } from './state.interface';

export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
  screenMode: ScreenModes;
  windowSize: Dimensions;
  gridAction: GridActionObj
}

export type GridState = {
  fillWith: FillGridWith
  isToCreateNew: boolean
}

export type AvailableAlgorithms = 'Dijkstra' | 'AStar';
export type ScreenModes = 'Fullscreen' | 'Desktop-wrapped';
export type FillGridWith = 'EMPTY' | 'WALL'
export type GridActionObj = {
  type: GridActionsType,
  data?: {
    [key: string]: any
  }
}

export const initalState: AppState = {
  selectedAlgorithm: 'Dijkstra',
  screenMode: 'Desktop-wrapped',
  windowSize: {
    height: window.innerHeight,
    width: window.innerWidth,
  },
  gridAction: {
    type: 'NONE',
    data: undefined
  }
}
