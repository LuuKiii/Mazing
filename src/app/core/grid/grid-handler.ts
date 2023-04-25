import { Actions } from "../../state/actions";
import { AppStateObserver } from "../../state/state.interface";
import { Store } from "../../state/store";
import { Grid } from './grid';
import { GridBuilder } from './grid-builder';


export class GridHandler implements AppStateObserver {
  private static instance: GridHandler;
  private grid: Grid
  private store: Store;

  private constructor() {
    this.grid = new GridBuilder().build();
    this.store = Store.getInstance();
    this.store.subscribe(this);
  }

  onAppStateChange(): void {
    const state = this.store.getState();
    const gridAction: GridActionsType = state.gridAction.type;

    switch (gridAction) {
      case 'CLEAR':
        this.createNewGrid();
        this.completeGridAction();
        break;
      case 'SET_NEXT_TILE_AS':
        //thats a temporary ugly workaround. gotta fix typing in those actions later
        if (state.gridAction.data && state.gridAction.data.setTo) {
          const setGridPoint = state.gridAction.data.setTo
          if (setGridPoint === 'start') this.setNextTileAsStartPoint();
          if (setGridPoint === 'end') this.setNextTileAsEndPoint();
        }
    }

    this.redrawGrid();
  }

  createNewGrid(): void {
    this.grid.createSheetAction();
  }

  setNextTileAsStartPoint(): void {
    this.grid.setNextTilePointFlagAction('start');
  }

  setNextTileAsEndPoint(): void {
    this.grid.setNextTilePointFlagAction('end')
  }

  completeGridAction(): void {
    this.store.dispatch(Actions.gridNoneAction())
  }

  redrawGrid(): void {
    this.grid.redrawAction();
  }

  static getInstance(): GridHandler {
    if (!GridHandler.instance) {
      GridHandler.instance = new GridHandler();
    }
    return GridHandler.instance;
  }
}

export type GridActionsType = 'CLEAR' | 'SET_NEXT_TILE_AS' | 'NONE'; 
