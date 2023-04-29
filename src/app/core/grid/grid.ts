import { Canvas } from "../canvas/canvas";
import { MouseObserver, MouseEventsType, PressedMouseButtonType } from "../canvas/canvas-interactions";
import { Position, Dimensions } from "../utils";
import { Tile, TilePoint, TilePointAllTypes, TileType } from './tile';


export class Grid implements MouseObserver {
  private static instance: Grid;
  private sheet: Tile[][] = [];
  private config: GridConfig;
  private canvas;

  private currentHoveredTile: Tile | null = null;
  private currentPointTiles: {
    [key in TilePoint]: Tile | null
  } = {
      start: null,
      end: null,
    }

  private actionsToPerformOnHoveredTile: ActionFlagsOnHoveredTileType = {
    changeTypeToEmpty: false,
    changeTypeToWall: false,
    setFlagToStart: false,
    setFlagToEnd: false,
  };

  private nextTileFlag: TilePointAllTypes = 'none';

  private startPosition: Position = { x: 0, y: 0 };
  private endPosition: Position = { x: 0, y: 0 }

  private constructor(config: GridConfig) {
    this.config = config;
    this.canvas = Canvas.getInstance();
    this.canvas.interaction.subscribeToMouseUpdates(this);

    this.calculateOffsetToCenter()
    this.createSheet()
    this.drawSheet();
  }

  private calculateOffsetToCenter(): void {
    this.startPosition = {
      x: ((this.canvas.getDimensions().width - this.config.gridDimensions.width) / 2),
      y: ((this.canvas.getDimensions().height - this.config.gridDimensions.height) / 2),
    }
    this.endPosition = {
      x: this.startPosition.x + this.config.tileColumns * this.config.tileSize,
      y: this.startPosition.y + this.config.tileRows * this.config.tileSize,
    }
  }

  private createSheet(): void {
    this.nullCurrentTiles();
    this.sheet = [];
    for (let i = 0; i < this.config.tileColumns; i++) {
      this.sheet[i] = [];
      for (let j = 0; j < this.config.tileRows; j++) {
        this.sheet[i].push(new Tile(i, j, this.config.tileSize, this.requestRedraw));
      }
    }
  }

  private drawSheet(): void {
    this.canvas.drawBackground();

    for (let i = 0; i < this.config.tileColumns; i++) {
      for (let j = 0; j < this.config.tileRows; j++) {
        this.drawTile(this.sheet[i][j]);
      }
    }
  }

  private drawTile(tile: Tile): void {
    this.canvas.draw(tile, this.startPosition)
  }

  requestRedraw(tile: Tile): void {
    this.drawTile(tile);
  }

  private setTileType(tile: Tile, type: TileType): void {
    tile.setType(type)
    this.drawTile(tile);
  }

  private setTileAsWall(tile: Tile): void {
    this.setTileType(tile, 'WALL')

    const currentTilePoint = tile.getPointType();
    if (currentTilePoint !== 'none') {
      this.unsetCurrentPoint(currentTilePoint);
    }
  }

  private setTileAsEmpty(tile: Tile): void {
    this.setTileType(tile, 'EMPTY')

    const currentTilePoint = tile.getPointType();
    if (currentTilePoint !== 'none') {
      this.unsetCurrentPoint(currentTilePoint);
    }
  }

  private setTileAsPoint(tile: Tile, tilePoint: TilePoint): void {
    this.setTileAsEmpty(tile);
    this.setNextTilePointFlag('none');

    if (tilePoint === 'start') this.setTileAsPointStart(tile);
    if (tilePoint === 'end') this.setTileAsPointEnd(tile);

    this.setNumberOfActionsToPerfomOnHoveredTiles({ setFlagToStart: false, setFlagToEnd: false })
  }

  private setTileAsPointFnFactory(pointToSet: TilePoint): (tile: Tile) => void {
    return (tile: Tile) => {
      if (this.isTileSavedAsOtherPoint(tile, pointToSet)) return;
      if (this.currentPointTiles[pointToSet]) this.unsetCurrentPoint(pointToSet);
      this.currentPointTiles[pointToSet] = tile;
      tile.setPointType(pointToSet);
      this.drawTile(tile);
    }
  }

  private getSavedTilePoint(tile: Tile): TilePoint | null {
    for (const pointName in this.currentPointTiles) {
      if (this.currentPointTiles[pointName as keyof typeof this.currentPointTiles] === tile) {
        return pointName as TilePoint;
      }
    }
    return null;
  }

  private isTileSavedAsOtherPoint(tile: Tile, expectedPoint: TilePoint): boolean {
    for (const pointName in this.currentPointTiles) {
      if (expectedPoint === pointName) continue;
      if (this.currentPointTiles[pointName as keyof typeof this.currentPointTiles] === tile) {
        return true;
      }
    }
    return false;
  }

  private setTileAsPointStart = this.setTileAsPointFnFactory('start');
  private setTileAsPointEnd = this.setTileAsPointFnFactory('end');

  private unsetCurrentPoint(tilePoint: TilePoint): void {
    if (!this.currentPointTiles[tilePoint]) return;
    this.currentPointTiles[tilePoint]?.setPointType('none')
    this.drawTile(this.currentPointTiles[tilePoint]!)
    this.currentPointTiles[tilePoint] === null;
  }

  setNumberOfActionsToPerfomOnHoveredTiles(setActions: Partial<ActionFlagsOnHoveredTileType>): void {
    this.actionsToPerformOnHoveredTile = {
      ...this.actionsToPerformOnHoveredTile,
      ...setActions
    }
  }

  //stuff on grid will be updated depending on flags set in 'actionsToPerformOnHoveredTile'. 
  private updateCurrentHoveredTileFromActions(): void {
    if (!this.currentHoveredTile) return;

    switch (true) {
      case this.actionsToPerformOnHoveredTile.setFlagToStart:
        this.setTileAsPoint(this.currentHoveredTile, 'start')
        break;
      case this.actionsToPerformOnHoveredTile.setFlagToEnd:
        this.setTileAsPoint(this.currentHoveredTile, 'end')
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToEmpty:
        this.setTileAsEmpty(this.currentHoveredTile);
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToWall:
        this.setTileAsWall(this.currentHoveredTile)
        break;
    }
  }

  updateFromMouse(mousePosition: Position, eventType: MouseEventsType, pressedMouseButtons: PressedMouseButtonType): void {
    switch (eventType) {
      case 'mousemove':
        const tile = this.getTileFromPosition(mousePosition);
        this.changeCurrentHoveredTile(tile)
        this.updateCurrentHoveredTileFromActions();
        break;
      case 'mouseup':
        this.handleMouseButtonReleased(pressedMouseButtons);
        break;
      case 'mousedown':
        this.handleMouseButtonPressed(pressedMouseButtons);
        this.updateCurrentHoveredTileFromActions();
        break;
      case 'mouseenter':
        this.handleMouseButtonPressed(pressedMouseButtons);
        this.updateCurrentHoveredTileFromActions();
        break;
      case 'mouseleave':
        this.removeCurrentHoveredTile();
        this.disableAllAcions();
        break;
    }
  }

  //these functions will just assing true to stuff that should be done on click, but what will be done in case if there will be multiple things set to true will be decided in updateCurrentHoveredTileFromActions
  private handleMouseButtonPressed(clickedButton: PressedMouseButtonType): void {
    if (clickedButton.lmb) {
      this.actionsToPerformOnHoveredTile.changeTypeToWall = true;
    }
    if (clickedButton.rmb) {
      this.actionsToPerformOnHoveredTile.changeTypeToEmpty = true;
    }
    if ((clickedButton.lmb || clickedButton.rmb) && this.nextTileFlag === 'start') {
      this.actionsToPerformOnHoveredTile.setFlagToStart = true;
    }
    if ((clickedButton.lmb || clickedButton.rmb) && this.nextTileFlag === 'end') {
      this.actionsToPerformOnHoveredTile.setFlagToEnd = true;
    }
  }

  private handleMouseButtonReleased(clickedButton: PressedMouseButtonType): void {
    if (!(clickedButton.lmb)) {
      this.actionsToPerformOnHoveredTile.changeTypeToWall = false;
    }
    if (!(clickedButton.rmb)) {
      this.actionsToPerformOnHoveredTile.changeTypeToEmpty = false;
    }
  }

  private disableAllAcions(): void {
    for (const actionName in this.actionsToPerformOnHoveredTile) {
      this.actionsToPerformOnHoveredTile[actionName as keyof ActionFlagsOnHoveredTileType] = false;
    }
  }

  private changeCurrentHoveredTile(tile: Tile | null): void {
    if (tile === this.currentHoveredTile) return;
    this.removeCurrentHoveredTile();
    if (!tile) return;
    this.setCurrentHoveredTile(tile)
  }

  private setCurrentHoveredTile(tile: Tile): void {
    this.currentHoveredTile = tile;
    this.currentHoveredTile.setHightlighted(true)
    this.canvas.draw(this.currentHoveredTile, this.startPosition);
  }

  private removeCurrentHoveredTile(): void {
    if (this.currentHoveredTile) {
      this.currentHoveredTile.setHightlighted(false)
      this.canvas.draw(this.currentHoveredTile, this.startPosition);
      this.currentHoveredTile = null;
    }
  }

  private nullCurrentTiles(): void {
    for (const tileName in this.currentPointTiles) {
      this.currentPointTiles[tileName as keyof typeof this.currentPointTiles] = null
    }
  }

  private setNextTilePointFlag(setAs: TilePointAllTypes): void {
    this.nextTileFlag = setAs
  }

  private isWithinGrid(pos: Position): boolean {
    if (pos.x < this.startPosition.x || pos.x > this.endPosition.x) return false;
    if (pos.y < this.startPosition.y || pos.y > this.endPosition.y) return false;

    return true;
  }

  private getTileFromPosition(pos: Position): Tile | null {
    if (!this.isWithinGrid(pos)) return null;

    const x = Math.floor((pos.x - this.startPosition.x) / this.config.tileSize);
    const y = Math.floor((pos.y - this.startPosition.y) / this.config.tileSize);

    return this.getTile(x, y);
  }

  private getTile(row: number, column: number): Tile | null {
    return this.sheet[row] ? this.sheet[row][column] : null;
  }

  //OutsideActions

  createSheetAction(): void {
    this.createSheet();
  }

  setNextTilePointFlagAction(setAs: TilePointAllTypes): void {
    this.setNextTilePointFlag(setAs)
  }

  redrawAction(): void {
    this.calculateOffsetToCenter();
    this.drawSheet();
  }

  static getNewInstance(config: GridConfig): Grid {
    if(Grid.instance) Grid.instance.canvas.interaction.unSubscribeToMouseUpdates(Grid.instance);
    Grid.instance = new Grid(config);
    return Grid.instance;
  }

  static getInstance(): Grid {
    if (!Grid.instance) throw new Error('Cannot create grid instance')
    return Grid.instance;
  }
}

type ActionFlagsOnHoveredTileType = Record<ActionsOnHoveredTileType, boolean>

type ActionsOnHoveredTileType = 'changeTypeToWall' | 'changeTypeToEmpty' | 'setFlagToStart' | 'setFlagToEnd';

export type GridConfig = {
  tileSize: number;
  tileRows: number;
  tileColumns: number;
  gridDimensions: Dimensions;
}

export type GridConfigSettable = Partial<Omit<GridConfig , 'gridDimensions'>>