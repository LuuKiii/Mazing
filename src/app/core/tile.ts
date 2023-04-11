import { colorHex, Drawable, Position } from "./utils"

export class Tile implements Drawable {
  private sheetPos: Position;
  private tileSize: number;
  private canvasPos: Position;

  constructor(x: number, y: number, size: number) {
    this.tileSize = size;
    this.sheetPos = {
      x: x,
      y: y,
    }
    this.canvasPos = {
      x: x * this.tileSize,
      y: y * this.tileSize,
    }
  }

  draw(ctx: CanvasRenderingContext2D, offSet: Position): void {
    ctx.fillStyle = colorHex.tileEmpty;
    ctx.fillRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize);
    ctx.strokeStyle = colorHex.tileStroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize)
  };
}

