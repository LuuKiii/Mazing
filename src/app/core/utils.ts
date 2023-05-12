export type Point = {
  x: number,
  y: number
}

export type PointRange = {
  start: Point,
  end: Point
}

export type Dimensions = {
  width: number,
  height: number
}

export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D, offSet: Point) => void;
}

export type StringLiteralUnionWithout<T, K extends T> = T extends K ? never : T
