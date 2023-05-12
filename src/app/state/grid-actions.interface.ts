import { GridConfigSettable } from '../core/grid/grid';
import { TilePointAllTypes } from '../core/grid/tile';
import { Action } from './state.interface';

export type GridActionObjType = {
  id: string,
  type: GridActionsType,
  data?: {
    [key: string]: any
  }
}

export type GridActionsType = 'CLEAR' | 'SET_NEXT_TILE_AS' | 'SET_SIZE' | 'GENERATE';

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
    data: {
      setTo: TilePointAllTypes
    }
  }
}

export interface GridResizeAction extends GridAction {
  payload: {
    id: string,
    type: 'SET_SIZE',
    data: {
      config: GridConfigSettable
    }
  }
}

export interface GridGenerateAction extends GridAction {
  payload: {
    id: string,
    type: 'GENERATE',
  }
}
