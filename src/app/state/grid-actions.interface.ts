import { TilePointAllTypes } from '../core/grid/tile';
import { Action } from './state.interface';

export type GridActionObjType = {
  id: string,
  type: GridActionsType,
  data?: {
    [key: string]: any
  }
}

export type GridActionsType = 'CLEAR' | 'SET_NEXT_TILE_AS' | 'SET_SIZE';

export interface GridAction extends Action {
  type: 'GRID_ACTION',
  payload: GridActionObjType
}

export interface GridClearAction extends GridAction {
  payload: {
    id: string,
    type: 'CLEAR',
    data: undefined
  }
}

export interface GridSetNextClickedTileAction extends GridAction {
  payload: {
    id: string,
    type: 'SET_NEXT_TILE_AS',
    data?: {
      setTo?: TilePointAllTypes
    }
  }
}

const obj: GridSetNextClickedTileAction = {
  type: 'GRID_ACTION',
  payload: {
    id: '',
    type: 'SET_NEXT_TILE_AS',
    data: {
      setTo: 'start'
    }
  }
}
