import { Canvas } from "./canvas";
import { MouseEventsType, MouseObserver, PressedMouseButtonType } from "./canvas-interactions";
import { Tile, TilePoint, TilePointAllTypes, TileType } from './tile';
import { Dimensions, Position, StringLiteralUnionWithout } from "./utils";

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

    const currentTilePoint = this.getCurrentTileAsPointName(tile)
    if (currentTilePoint !== 'none') {
      this.unsetTileAsPoint(currentTilePoint);
    }
  }

  private setTileAsEmpty(tile: Tile): void {
    this.setTileType(tile, 'EMPTY')

    const currentTilePoint = this.getCurrentTileAsPointName(tile)
    if (currentTilePoint !== 'none') {
      this.unsetTileAsPoint(currentTilePoint);
    }
  }

  private setTileAsPoint(tile: Tile, tilePoint: TilePoint): void {
    this.setTileAsEmpty(tile);
    this.setNextTilePointFlag('none');

    if (tilePoint === 'start') this.setTileAsPointStart(tile)
    if (tilePoint === 'end') this.setTileAsPointEnd(tile)

    this.actionsToPerformOnHoveredTile.setFlagToStart = false;
    this.actionsToPerformOnHoveredTile.setFlagToEnd = false;
  }

  private setTileAsPointStart(tile: Tile): void {
    if (this.currentPointTiles.end === tile) return;
    if (this.currentPointTiles.start) this.unsetTileAsPoint('start');
    this.currentPointTiles.start = tile;
    tile.setFlag('isStartPoint', true);
    this.drawTile(tile);
  }

  private setTileAsPointEnd(tile: Tile): void {
    if (this.currentPointTiles.start === tile) return;
    if (this.currentPointTiles.end) this.unsetTileAsPoint('end');
    this.currentPointTiles.end = tile;
    tile.setFlag('isEndPoint', true);
    this.drawTile(tile);
  }

  private getCurrentPointTile(tile: Tile): keyof typeof this.currentPointTiles | null {
    for (const keyName in this.currentPointTiles) {
      if (this.currentPointTiles[keyName as keyof typeof this.currentPointTiles] === tile) return keyName as keyof typeof this.currentPointTiles;
    }
    return null;
  }

  private getCurrentTileAsPointName(tile: Tile): TilePointAllTypes {
    const currentTile = this.getCurrentPointTile(tile);
    switch (currentTile) {
      case 'start':
        return 'start';
      case 'end':
        return 'end';
      default:
        return 'none';
    }
  }

  private unsetTileAsPoint(tilePoint: TilePoint): void {
    if (!this.currentPointTiles[tilePoint]) return;
    this.currentPointTiles[tilePoint]?.setFlag('isStartPoint', false);
    this.currentPointTiles[tilePoint]?.setFlag('isEndPoint', false);
    this.drawTile(this.currentPointTiles[tilePoint]!)
    this.currentPointTiles[tilePoint] === null;
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
    this.currentHoveredTile.setFlag('isHighlight', true);
    this.canvas.draw(this.currentHoveredTile, this.startPosition);
  }

  private removeCurrentHoveredTile(): void {
    if (this.currentHoveredTile) {
      this.currentHoveredTile.setFlag('isHighlight', false);
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

  static getInstance(config?: GridConfig): Grid {
    if (!Grid.instance) {
      if (!config) throw new Error('Cannot create grid instance')
      Grid.instance = new Grid(config);
    }
    return Grid.instance;
  }
}

type ActionFlagsOnHoveredTileType = Record<ActionsOnHoveredTileType, boolean>

type ActionsOnHoveredTileType = 'changeTypeToWall' | 'changeTypeToEmpty' | 'setFlagToStart' | 'setFlagToEnd';

type GridConfig = {
  tileSize: number;
  tileRows: number;
  tileColumns: number;
  gridDimensions: Dimensions;
}
