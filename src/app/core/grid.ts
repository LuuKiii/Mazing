import { AppStateObserver } from "../state/state.interface";
import { AppState } from "../state/state";
import { Store } from "../state/store";
import { TileType } from "../utils/colors";
import { Canvas } from "./canvas";
import { MouseEventsType, MouseObserver, PressedMouseButtonType, mouseButtons } from "./canvas-interactions";
import { Tile } from "./tile";
import { Dimensions, Position } from "./utils";
import { Actions } from "../state/actions";

export class Grid implements AppStateObserver, MouseObserver {
  private static instance: Grid;
  private sheet: Tile[][] = [];
  private config: GridConfig;
  private canvas;
  private store;

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

  private startPosition: Position = { x: 0, y: 0 };
  private endPosition: Position = { x: 0, y: 0 }

  private constructor(config: GridConfig) {
    this.config = config;
    this.canvas = Canvas.getInstance();
    this.canvas.interaction.subscribeToMouseUpdates(this);
    this.store = Store.getInstance();
    this.store.subscribe(this)

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

  createSheet(): void {
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

  onAppStateChange(): void {
    const state = this.store.getState()

    if (state.gridActions.isToCreateNew) {
      //this function will be called again due to new dispatch, therefor it returns here to not draw sheet two times
      this.createSheet();
      this.store.dispatch(Actions.fillGridWith(state.gridActions.fillWith, false))
      return;
    }

    console.log(state)
    switch (state.setNextTileAs) {
      case 'start':
        this.actionsToPerformOnHoveredTile.setFlagToStart = true;
        break;
      case 'end':
        this.actionsToPerformOnHoveredTile.setFlagToEnd = true;
        break;
      default:
        this.actionsToPerformOnHoveredTile.setFlagToEnd = false;
        this.actionsToPerformOnHoveredTile.setFlagToStart = false;
    }

    this.calculateOffsetToCenter();
    this.drawSheet();
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
      case this.actionsToPerformOnHoveredTile.changeTypeToEmpty:
        //this code will be changed, for now i just want this to work
        if (this.actionsToPerformOnHoveredTile.setFlagToStart) {
          this.currentTile.hover.setFlag("isStartPoint", true)
          //need to assing this through one dedicated method to avoid trouble down the road.
          this.currentTile.start = this.currentTile.hover;
          this.store.dispatch(Actions.setNextTileAs(null))
          return;
        }
        if (this.actionsToPerformOnHoveredTile.setFlagToEnd) {
          this.currentTile.hover.setFlag("isEndPoint", true)
          this.currentTile.end = this.currentTile.hover;
          this.store.dispatch(Actions.setNextTileAs(null))
          return;
        }
        this.setTileAsEmpty(this.currentTile.hover);
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToWall:
        this.setTileAsWall(this.currentTile.hover)
        break;
    }
  }

  private handleMouseButtonPressed(clickedButton: PressedMouseButtonType): void {
    if (clickedButton.lmb) {
      this.actionsToPerformOnHoveredTile.changeTypeToWall = true;
    }
    if (clickedButton.rmb) {
      this.actionsToPerformOnHoveredTile.changeTypeToEmpty = true;
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

  isWithinGrid(pos: Position): boolean {
    if (pos.x < this.startPosition.x || pos.x > this.endPosition.x) return false;
    if (pos.y < this.startPosition.y || pos.y > this.endPosition.y) return false;

    return true;
  }

  getTileFromPosition(pos: Position): Tile | null {
    if (!this.isWithinGrid(pos)) return null;

    const x = Math.floor((pos.x - this.startPosition.x) / this.config.tileSize);
    const y = Math.floor((pos.y - this.startPosition.y) / this.config.tileSize);

    return this.getTile(x, y);
  }

  getTile(row: number, column: number): Tile | null {
    return this.sheet[row] ? this.sheet[row][column] : null;
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

