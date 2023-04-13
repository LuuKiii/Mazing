import { Canvas } from "./canvas";
import { Grid } from "./grid";

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
      defaultValue: 30,
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

    return Grid.getInstance({
      tileSize: this.tileSize.value,
      tileRows: this.tileRows.value,
      tileColumns: this.tilesColumns.value,
      gridDimensions: {
        width: this.tilesColumns.value * this.tileSize.value,
        height: this.tileRows.value * this.tileSize.value,
      }
    });
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

