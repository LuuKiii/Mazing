export const colorHex = {
  tileStroke: '#4d596f',
  tileWall: '#202231',
  tileEmpty: '#b3c2d0',
  canvasBG: '#202231'
}

export type Position = {
  x: number,
  y: number
}

export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D) => void;
}
