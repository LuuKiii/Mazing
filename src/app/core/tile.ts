import { colorHex, Drawable, Position } from "./utils"

export class Tile implements Drawable {
  private sheetPos: Position;
  private tileSize: number;
  private canvasPos: Position;
  private offsetToCenter: Position;

  constructor(x: number, y: number, size: number, offsetToCenter: Position) {
    this.tileSize = size;
    this.offsetToCenter = offsetToCenter; 
    this.sheetPos = {
      x: x,
      y: y,
    }
    this.canvasPos = {
      x: x * this.tileSize + offsetToCenter.x,
      y: y * this.tileSize + offsetToCenter.y,
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = colorHex.tileEmpty;
    ctx.fillRect(this.canvasPos.x, this.canvasPos.y, this.tileSize, this.tileSize);
    ctx.strokeStyle = colorHex.tileStroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.canvasPos.x, this.canvasPos.y, this.tileSize, this.tileSize)
  };
}

