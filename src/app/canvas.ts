export class Canvas {
  private static instance: Canvas;

  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private constructor() {
    this.element = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.element.getContext('2d')

    this.init();
  }

  private init() {
    this.element.style.width = '1024px'
    this.element.style.height = '1024px'
  }

  static getInstance(): Canvas {
    if (!Canvas.instance) {
      Canvas.instance = new Canvas();
    }
    return Canvas.instance;
  }
}
