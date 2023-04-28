import { ScreenModes } from "../../state/state";
import { AppStateObserver } from "../../state/state.interface";
import { Store } from "../../state/store";
import { ColorObject } from "../../utils/colors";
import { Dimensions, Drawable, Position } from "../utils";
import { CanvasInteractions } from "./canvas-interactions";


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

  private canvasObservers: CanvasObserver[] = [];

  private constructor() {
    this.element = document.getElementById('canvas') as HTMLCanvasElement;
    this.interactions = CanvasInteractions.getInstance();
    this.ctx = this.element.getContext('2d')!

    this.store = Store.getInstance();
    this.onAppStateChange()
    this.store.subscribe(this);
  }

  private changeCanvasDimensions(changeSizeTo: ScreenModes, windowSize: Dimensions): void {
    if (changeSizeTo === this.currentScreenMode) return;
    this.currentScreenMode = changeSizeTo;

    switch (this.currentScreenMode) {
      case 'Fullscreen':
        this.dimensions = {
          width: windowSize.width,
          height: windowSize.height,
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
    this.updateCanvasObservers();
  }

  private applyCanvasDimensions(): void {
    this.element.width = this.dimensions.width;
    this.element.height = this.dimensions.height;
  }

  onAppStateChange(): void {
    const nextScreenMode = Store.getInstance().getState().screenMode;
    const dimensions = Store.getInstance().getState().windowSize
    this.changeCanvasDimensions(nextScreenMode, dimensions);
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

  subscribeToCanvas(ob: CanvasObserver): void {
    this.canvasObservers.push(ob);
  }

  updateCanvasObservers(): void {
    this.canvasObservers.forEach(ob => {
      ob.updateFromCanvas();
    });
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

export interface CanvasObserver {
  updateFromCanvas(): void
}
