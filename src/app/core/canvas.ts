import { Dimensions, Drawable, Position } from "./utils";
import { Store } from '../state/store'
import { AppStateObserver } from "../state/state.interface";
import { ScreenModes } from "../state/state";
import { CanvasInteractions } from './canvas-interactions'
import { ColorObject } from '../utils/colors'

export class Canvas implements AppStateObserver {
  private static instance: Canvas;

  private element: HTMLCanvasElement;
  private interactions: CanvasInteractions;
  private ctx: CanvasRenderingContext2D;
  private currentScreenMode: ScreenModes | null = null;
  private store: Store;

  private dimensions: Dimensions = {
    width: 0,
    height: 0,
  };

  private constructor() {
    this.element = document.getElementById('canvas') as HTMLCanvasElement;
    this.interactions = CanvasInteractions.getInstance();
    this.ctx = this.element.getContext('2d')!

    this.store = Store.getInstance();
    this.onAppStateChange()
    this.store.subscribe(this);
  }

  private changeCanvasDimensions(changeSizeTo: ScreenModes): void {
    if (changeSizeTo === this.currentScreenMode) return;

    this.currentScreenMode = changeSizeTo;

    switch (this.currentScreenMode) {
      case 'Fullscreen':
        this.dimensions = {
          width: document.body.clientWidth,
          height: document.documentElement.clientHeight,
        }
        break;
      case "Desktop-wrapped":
        this.dimensions = {
          width: 1024,
          height: 600
        }
        break;
    }

    this.applyCanvasDimensions();
  }

  private applyCanvasDimensions(): void {
    this.element.width = this.dimensions.width;
    this.element.height = this.dimensions.height;
  }

  onAppStateChange(): void {
    const nextScreenMode = Store.getInstance().getState().screenMode;
    this.changeCanvasDimensions(nextScreenMode);
  }

  drawBackground(): void {
    this.ctx.fillStyle = ColorObject.canvas.background
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height)
  }

  draw(el: Drawable, offSet?: Position): void {
    el.draw(this.ctx, offSet ? offSet : { x: 0, y: 0 });
  }

  getDimensions() {
    return { ...this.dimensions };
  }

  get interaction() {
    return this.interactions
  }

  static getInstance(): Canvas {
    if (!Canvas.instance) {
      Canvas.instance = new Canvas();
    }
    return Canvas.instance;
  }
}
