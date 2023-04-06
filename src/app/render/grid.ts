import { Canvas } from "./canvas";
import { Tile } from "./tile";

export class Grid {
  private static instance: Grid;
  private sheet: Tile[][] = [];
  private config: GridConfig;
  private canvas = Canvas.getInstance();

  private offSetToCenter: { x: number, y: number }

  //offSetToCenter allows to make canvas look like its centered
  private constructor(config: GridConfig, offsetToCenter: { x: number, y: number }) {
    this.config = config;
    this.offSetToCenter = { ...offsetToCenter };
    this.createSheet()
    this.drawSheet();
  }

  createSheet(): void {
    for (let i = 0; i < this.config.tilesColumns; i++) {
      this.sheet[i] = [];
      for (let j = 0; j < this.config.tileRows; j++) {
        this.sheet[i].push(new Tile(i, j, this.config.tileSize, this.offSetToCenter));
      }
    }
  }

  drawSheet(): void {
    this.canvas.drawBackground();

    for (let i = 0; i < this.config.tilesColumns; i++) {
      for (let j = 0; j < this.config.tileRows; j++) {
        this.canvas.draw(this.sheet[i][j]);
      }
    }
  }

  static getInstance(config?: GridConfig, offSetToCenter = { x: 0, y: 0 }): Grid {
    if (!Grid.instance) {
      if (!config) throw new Error('Cannot create grid instance')
      Grid.instance = new Grid(config, offSetToCenter);
    }
    return Grid.instance;
  }
}

type GridConfig = {
  tileSize: number;
  tileRows: number;
  tilesColumns: number;
}

type GridBuilderRange = {
  value?: number;
  maxValue: number;
  minValue: number;
  defaultValue: number;
}

export class GridBuilder {
  tileSize: GridBuilderRange;
  tileRows: GridBuilderRange;
  tilesColumns: GridBuilderRange;

  private canvasDimensions = Canvas.getInstance().getDimensions();

  constructor() {
    //these values need adjusting. also consider what happens for diffrent canvas sizes.
    this.tileSize = {
      minValue: 10,
      maxValue: 50,
      defaultValue: 25,
    }
    this.tileRows = {
      minValue: 5,
      maxValue: 50,
      defaultValue: Math.floor(this.canvasDimensions.height / this.tileSize.defaultValue),
    }
    this.tilesColumns = {
      minValue: 5,
      maxValue: 50,
      defaultValue: Math.floor(this.canvasDimensions.width / this.tileSize.defaultValue),
    }
  }

  withTileSize(size: number | undefined): GridBuilder {
    if (size === undefined) return this;

    this.tileSize.value = this.validateInRange(size, this.tileSize);

    return this;
  }

  withTileRows(rows: number | undefined): GridBuilder {
    if (rows === undefined) return this;

    this.tileRows.value = this.validateInRange(rows, this.tileRows)

    return this;
  }

  withTileColumns(columns: number | undefined): GridBuilder {
    if (columns === undefined) return this;

    this.tilesColumns.value = this.validateInRange(columns, this.tilesColumns)
    return this;
  }

  //this build method needs testing and adjusting, for now this simplified logic will do
  build(): Grid {
    if (!this.tilesColumns.value) {
      this.tilesColumns.value = this.tileSize.value ? this.validateInRange(Math.floor(this.canvasDimensions.width / this.tileSize.value), this.tilesColumns) : this.tilesColumns.defaultValue;
    }
    if (!this.tileRows.value) {
      this.tileRows.value = this.tileSize.value ? this.validateInRange(Math.floor(this.canvasDimensions.height / this.tileSize.value), this.tileRows) : this.tileRows.defaultValue;
    }
    if (!this.tileSize.value) {
      this.tileSize.value = this.validateInRange(Math.floor(this.canvasDimensions.width / this.tilesColumns.value), this.tileSize)
    }

    const offSetToCenter = {
      x: (this.canvasDimensions.width % this.tileSize.value) / 2,
      y: (this.canvasDimensions.height % this.tileSize.value) / 2,
    }

    return Grid.getInstance({
      tileSize: this.tileSize.value,
      tileRows: this.tileRows.value,
      tilesColumns: this.tilesColumns.value
    },
      offSetToCenter);
  }

  private validateInRange(value: number, range: GridBuilderRange): number {
    if (range.maxValue < range.minValue) throw new Error('Range does not exist')
    if (value > range.maxValue || value < range.minValue) {
      return range.defaultValue;
    } else {
      return Math.floor(value);
    }
  }
}

