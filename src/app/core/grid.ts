import { AppStateObserver } from "../state/redux.interface";
import { AppState } from "../state/state";
import { Store } from "../state/store";
import { Canvas } from "./canvas";
import { MouseObserver } from "./canvas-interactions";
import { Tile } from "./tile";
import { Dimensions, Position } from "./utils";

export class Grid implements AppStateObserver, MouseObserver {
  private static instance: Grid;
  private sheet: Tile[][] = [];
  private config: GridConfig;
  private canvas;
  private store;

  private currentHighlight: Tile | null = null;

  private startPosition: Position = { x: 0, y: 0 };
  private endPosition: Position = { x: 0, y: 0 }

  //offSetToCenter allows to make canvas look like its centered
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

  calculateOffsetToCenter(): void {
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
    for (let i = 0; i < this.config.tileColumns; i++) {
      this.sheet[i] = [];
      for (let j = 0; j < this.config.tileRows; j++) {
        this.sheet[i].push(new Tile(i, j, this.config.tileSize));
      }
    }
  }

  drawSheet(): void {
    this.canvas.drawBackground();

    for (let i = 0; i < this.config.tileColumns; i++) {
      for (let j = 0; j < this.config.tileRows; j++) {
        this.canvas.draw(this.sheet[i][j], this.startPosition);
      }
    }
  }

  drawTile(tile: Tile): void {
    this.canvas.draw(tile, this.startPosition)
  }

  onAppStateChange(): void {
    this.calculateOffsetToCenter();
    this.drawSheet();
  }

  updateFromMouse(mousePosition: Position): void {
    const tile = this.getTileFromPosition(mousePosition);
    if (!tile) return;

    this.updateHighlight(tile)
  }

  updateHighlight(tile: Tile) {
    if (tile === this.currentHighlight) return;


    if (this.currentHighlight) {
      this.currentHighlight.setFlag('isHighlight', false);
      this.canvas.draw(this.currentHighlight, this.startPosition);
    }
    this.currentHighlight = tile;
    this.currentHighlight.setFlag('isHighlight', true);
    this.canvas.draw(this.currentHighlight, this.startPosition);
  }

  isWithinGrid(pos: Position): boolean {
    if (pos.x < this.startPosition.x || pos.x > this.endPosition.x) return false;
    if (pos.y < this.startPosition.y || pos.y > this.endPosition.y) return false;

    return true;
  }

  getTileFromPosition(pos: Position): Tile | null {
    if (!this.isWithinGrid(pos)) return null;

    const x = Math.floor(pos.x / this.config.tileSize);
    const y = Math.floor(pos.y / this.config.tileSize);

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

type GridConfig = {
  tileSize: number;
  tileRows: number;
  tileColumns: number;
  gridDimensions: Dimensions;
}

