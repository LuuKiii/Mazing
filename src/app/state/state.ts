import { Dimensions } from "../core/utils";
import { GridActionObjType } from './grid-actions.interface';

export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
  screenMode: ScreenModes;
  windowSize: Dimensions;
  gridAction: GridActionObjType
}

export type GridState = {
  fillWith: FillGridWith
  isToCreateNew: boolean
}

export type AvailableAlgorithms = 'Dijkstra' | 'AStar';
export type ScreenModes = 'Fullscreen' | 'Desktop-wrapped';
export type FillGridWith = 'EMPTY' | 'WALL'

export const initialState: AppState = {
  selectedAlgorithm: 'Dijkstra',
  screenMode: 'Desktop-wrapped',
  windowSize: {
    height: window.innerHeight,
    width: window.innerWidth,
  },
  gridAction: {
    id: '',
    type: 'CLEAR',
    data: undefined
  }
}
