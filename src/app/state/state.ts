export interface AppState {
  selectedAlgorithm: AvailableAlgorithms;
}

export type AvailableAlgorithms = 'Dijkstra' | 'AStar' 

export const initalState: AppState = {
  selectedAlgorithm: 'Dijkstra'
}
