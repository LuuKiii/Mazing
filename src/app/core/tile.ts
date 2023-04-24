import { Drawable, Position, StringLiteralUnionWithout } from "./utils"
import { ColorObject } from '../utils/colors'

export class Tile implements Drawable {
  private sheetPos: Position;
  private tileSize: number;
  private canvasPos: Position;
  private type: TileType;
  private flags: TileFlags = {
    isHighlight: false,
    isStartPoint: false,
    isEndPoint: false,
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
    if (this.type === 'WALL') {
      return ColorObject.tile[this.type][colorType][this.flags.isHighlight ? 'highlight' : 'normal'];
    } else {
      return ColorObject.tile[this.type][this.getOneFlagByPriorityAsString()][colorType][this.flags.isHighlight ? 'highlight' : 'normal']
    }
  }

  getOneFlagByPriorityAsString(): TilePointAllTypes {
    switch (true) {
      case this.flags.isStartPoint:
        return 'start'
      case this.flags.isEndPoint:
        return 'end'
      default:
        return 'none'
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

export type TIleColoredElements = 'fill' | 'outline'
export type TileType = 'WALL' | 'EMPTY';
export type TilePointAllTypes = 'none' | 'start' | 'end';
export type TilePoint = StringLiteralUnionWithout<TilePointAllTypes, 'none'>
export type TileFlags = {
  isHighlight: boolean,
  isStartPoint: boolean,
  isEndPoint: boolean,
}
