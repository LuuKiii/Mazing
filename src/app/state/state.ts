export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
  screenMode: ScreenModes;
}

export type AvailableAlgorithms = 'Dijkstra' | 'AStar';
export type ScreenModes = 'Fullscreen' | 'Desktop-wrapped';

export const initalState: AppState = {
  selectedAlgorithm: 'Dijkstra',
  screenMode: 'Desktop-wrapped',
}
