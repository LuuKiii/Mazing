import { GridActionObjType } from "../../state/grid-actions.interface";
import { AppStateObserver } from "../../state/state.interface";
import { Store } from "../../state/store";
import { Canvas, CanvasObserver } from "../canvas/canvas";
import { Grid, GridConfigSettable } from './grid';
import { GridBuilder } from './grid-builder';


export class GridHandler implements AppStateObserver, CanvasObserver {
  private static instance: GridHandler;
  private grid: Grid
  private store: Store;
  private prevGridActionId: string = '';

  private constructor() {
    this.grid = new GridBuilder().build();
    this.store = Store.getInstance();
    this.store.subscribe(this);
    Canvas.getInstance().subscribeToCanvas(this);
  }

  onAppStateChange(): void {
    const state = this.store.getState();
    const gridAction: GridActionObjType = state.gridAction;

    if (state.gridAction.id === this.prevGridActionId) return;
    this.prevGridActionId = state.gridAction.id;

    switch (gridAction.type) {
      case 'CLEAR':
        this.createNewGrid();
        break;
      case 'SET_NEXT_TILE_AS':
        //thats a temporary ugly workaround. gotta fix typing in those actions later
        if (!state.gridAction.data) break;
        const setGridPoint = state.gridAction.data.setTo
        if (setGridPoint === 'start') this.setNextTileAsStartPoint();
        if (setGridPoint === 'end') this.setNextTileAsEndPoint();
        break;
      case 'SET_SIZE':
        if (!state.gridAction.data) break;
        this.resizeGrid(state.gridAction.data.config);
        break;
    }

    this.redrawGrid();
  }

  updateFromCanvas(): void {
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

  redrawGrid(): void {
    this.grid.redrawAction();
  }

  resizeGrid(gridConfig: GridConfigSettable): void {
    const newGrid = new GridBuilder()
      .withTileSize(gridConfig.tileSize)
      .withTileColumns(gridConfig.tileColumns)
      .withTileRows(gridConfig.tileRows)
      .build()
    this.grid = newGrid;
  }

  static getInstance(): GridHandler {
    if (!GridHandler.instance) {
      GridHandler.instance = new GridHandler();
    }
    return GridHandler.instance;
  }
}
