export type Position = {
  x: number,
  y: number
}

export type Dimensions = {
  width: number,
  height: number
}

export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D, offSet: Position) => void;
}

export type StringLiteralUnionWithout<T, K extends T> = T extends K ? never : T
