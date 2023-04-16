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

  private currentHoveredTile: Tile | null = null;
  private actionsToPerformOnHoveredTile: ActionFlagsOnHoveredTileType = {
    changeTypeToEmpty: false,
    changeTypeToWall: false
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
    if (!this.currentHoveredTile) return;

    switch (true) {
      case this.actionsToPerformOnHoveredTile.changeTypeToEmpty:
        this.setTileAsEmpty(this.currentHoveredTile);
        break;
      case this.actionsToPerformOnHoveredTile.changeTypeToWall:
        this.setTileAsWall(this.currentHoveredTile)
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

type ActionsOnHoveredTileType = 'changeTypeToWall' | 'changeTypeToEmpty';

type GridConfig = {
  tileSize: number;
  tileRows: number;
  tileColumns: number;
  gridDimensions: Dimensions;
}

