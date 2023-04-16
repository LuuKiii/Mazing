export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
  screenMode: ScreenModes;
  gridActions: GridState
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
  gridActions: {
    fillWith: 'EMPTY',
    isToCreateNew: false,
  }
}
