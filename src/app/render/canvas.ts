import { colorHex } from "./utils";

export class Canvas {
  private static instance: Canvas;

  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private elementsToDraw: Drawable[] = [];

  private dimensions = {
    width: 1024,
    height: 600,
  }

  private constructor() {
    this.element = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.element.getContext('2d')!

    this.init();
  }

  private init(): void {
    this.element.width = this.dimensions.width;
    this.element.height = this.dimensions.height;
  }

  drawBackground(): void {
    this.ctx.fillStyle = colorHex.canvasBG;
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height)
  }

  draw(el: Drawable): void {
    el.draw(this.ctx);
  }

  getDimensions() {
    return { ...this.dimensions };
  }

  static getInstance(): Canvas {
    if (!Canvas.instance) {
      Canvas.instance = new Canvas();
    }
    return Canvas.instance;
  }
}

export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D) => void;
}
