import { Drawable, Point, StringLiteralUnionWithout } from "../utils";
import { ColorObject } from '../../utils/colors';


export class Tile implements Drawable {
  private sheetPos: Point;
  private tileSize: number;
  private canvasPos: Point;
  private type: TileType;
  private pointType: TilePointAllTypes;
  private isHighlighted: boolean = false;
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
    this.pointType = 'none';
    this.redrawMethod = redrawMethod;
  }

  setType(type: TileType): void {
    this.type = type;
  }

  setPointType(pointName: TilePointAllTypes): void {
    this.pointType = pointName;
  }

  getPointType(): TilePointAllTypes {
    return this.pointType;
  }

  getType(): TileType {
    return this.type;
  }

  setHightlighted(value: boolean): void {
    this.isHighlighted = value;
  }

  getColor(colorType: TIleColoredElements): string {
    if (this.type === 'WALL') {
      return ColorObject.tile[this.type][colorType][this.isHighlighted ? 'highlight' : 'normal'];
    } else {
      return ColorObject.tile[this.type][this.pointType][colorType][this.isHighlighted ? 'highlight' : 'normal']
    }
  }

  requestRedraw(): void {
    this.redrawMethod(this);
  }

  draw(ctx: CanvasRenderingContext2D, offSet: Point): void {
    ctx.fillStyle = this.getColor('fill')
    ctx.fillRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize);
    ctx.strokeStyle = this.getColor('outline')
    ctx.lineWidth = 2;
    ctx.strokeRect(this.canvasPos.x + offSet.x, this.canvasPos.y + offSet.y, this.tileSize, this.tileSize)
  };
}

export type TIleColoredElements = 'fill' | 'outline';
export type TileType = 'WALL' | 'EMPTY';
export type TilePointAllTypes = 'none' | 'start' | 'end';
export type TilePoint = StringLiteralUnionWithout<TilePointAllTypes, 'none'>
export type TileFlags = {
  isHighlight: boolean,
  isStartPoint: boolean,
  isEndPoint: boolean,
}
