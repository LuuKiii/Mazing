export type Position = {
  x: number,
  y: number
}

export type Dimensions = {
  width: number,
  height: number
}

export type TileFlags = {
  isHighlight: boolean,
  isStartPoint: boolean,
  isEndPoint: boolean,
}

export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D, offSet: Position) => void;
}
