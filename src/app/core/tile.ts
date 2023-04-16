import { Drawable, Position, TileFlags } from "./utils"
import { ColorObject, TIleColoredElements, TileType } from '../utils/colors'
import { Grid } from "./grid";

export class Tile implements Drawable {
  private sheetPos: Position;
  private tileSize: number;
  private canvasPos: Position;
  private type: TileType;
  private flags: TileFlags = {
    isHighlight: false,
  }
  private redrawMethod: (t: Tile) => void;

  constructor(x: number, y: number, size: number, redrawMethod: ((tile: Tile) => void)) {
    this.tileSize = size;
    this.sheetPos = {
      x: x,
      y: y,
    }
    this.canvasPos = {
      x: x * this.tileSize,
      y: y * this.tileSize,
    }
    this.type = 'EMPTY';
    this.redrawMethod = redrawMethod
  }

  setType(type: TileType): void {
    this.type = type;
  }

  setFlag(flag: keyof TileFlags, value: boolean): void {
    this.flags[flag] = value;
  }

  getColor(colorType: TIleColoredElements): string {
    switch (true) {
      case this.flags.isHighlight:
        return ColorObject.tile.highlight[this.type][colorType];
      default:
        return ColorObject.tile.normal[this.type][colorType];
    }
  }

  requestRedraw(): void {
    this.redrawMethod(this);
  }

  draw(ctx: CanvasRenderingContext2D, offSet: Position): void {
    ctx.fillStyle = this.getColor('fill')
    ctx.fillRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize);
    ctx.strokeStyle = this.getColor('outline')
    ctx.lineWidth = 2;
    ctx.strokeRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize)
  };
}