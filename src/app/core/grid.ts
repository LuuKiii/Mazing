import { Canvas } from "./canvas";
import { MouseEventsType, MouseObserver, PressedMouseButtonType } from "./canvas-interactions";
import { Tile, TilePoint, TileType } from "./tile";
import { Dimensions, Position, StringLiteralUnionWithout } from "./utils";

export class Grid implements MouseObserver {
  private static instance: Grid;
  private sheet: Tile[][] = [];
  private config: GridConfig;
  private canvas;

  private currentTile: {
    hover: Tile | null,
    start: Tile | null,
    end: Tile | null,
  } = {
      hover: null,
      start: null,
      end: null,
    }

  private actionsToPerformOnHoveredTile: ActionFlagsOnHoveredTileType = {
    changeTypeToEmpty: false,
    changeTypeToWall: false,
    setFlagToStart: false,
    setFlagToEnd: false,
  };

  private nextTileFlag: TilePoint = 'none';

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
  }

  private setTileAsEmpty(tile: Tile): void {
    this.setTileType(tile, 'EMPTY')
  }

  private setTileAsPoint(tile: Tile, tilePoint: StringLiteralUnionWithout<TilePoint, 'none'>): void {
    this.setTileAsEmpty(tile);
    this.setNextTilePointFlag('none');

    if (tilePoint === 'start') this.setTileAsPointStart(tile)
    if (tilePoint === 'end') this.setTileAsPointEnd(tile)

    this.actionsToPerformOnHoveredTile.setFlagToStart = false;
    this.actionsToPerformOnHoveredTile.setFlagToEnd = false;
  }

  private setTileAsPointStart(tile: Tile): void {
    if (this.currentTile.end === tile) return;
    if (this.currentTile.start) this.unsetTileAsPoint('start');
    this.currentTile.start = tile;
    tile.setFlag('isStartPoint', true);
    this.drawTile(tile);
  }

  private setTileAsPointEnd(tile: Tile): void {
    if (this.currentTile.start === tile) return;
    if (this.currentTile.end) this.unsetTileAsPoint('end');
    this.currentTile.end = tile;
    tile.setFlag('isEndPoint', true);
    this.drawTile(tile);
  }

  private unsetTileAsPoint(tilePoint: StringLiteralUnionWithout<TilePoint, 'none'>): void {
    if (!this.currentTile[tilePoint]) return;
    this.currentTile[tilePoint]?.setFlag('isStartPoint', false);
    this.currentTile[tilePoint]?.setFlag('isEndPoint', false);
    this.drawTile(this.currentTile[tilePoint]!)
    this.currentTile[tilePoint] === null;
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
    if (!this.currentTile.hover) return;

    switch (true) {
      case this.actionsToPerformOnHoveredTile.setFlagToStart:
        this.setTileAsPoint(this.currentTile.hover, 'start')
        break;
      case this.actionsToPerformOnHoveredTile.setFlagToEnd:
        this.setTileAsPoint(this.currentTile.hover, 'end')
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToEmpty:
        this.setTileAsEmpty(this.currentTile.hover);
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToWall:
        this.setTileAsWall(this.currentTile.hover)
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
    if (tile === this.currentTile.hover) return;
    this.removeCurrentHoveredTile();
    if (!tile) return;
    this.setCurrentHoveredTile(tile)
  }

  private setCurrentHoveredTile(tile: Tile): void {
    this.currentTile.hover = tile;
    this.currentTile.hover.setFlag('isHighlight', true);
    this.canvas.draw(this.currentTile.hover, this.startPosition);
  }

  private removeCurrentHoveredTile(): void {
    if (this.currentTile.hover) {
      this.currentTile.hover.setFlag('isHighlight', false);
      this.canvas.draw(this.currentTile.hover, this.startPosition);
      this.currentTile.hover = null;
    }
  }

  private nullCurrentTiles(except?: keyof typeof this.currentTile): void {
    for (const tileName in this.currentTile) {
      if (tileName === except) continue;
      this.currentTile[tileName as keyof typeof this.currentTile] = null
    }
  }

  private setNextTilePointFlag(setAs: TilePoint): void {
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

  setNextTilePointFlagAction(setAs: TilePoint): void {
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
