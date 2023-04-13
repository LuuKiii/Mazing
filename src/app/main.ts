import { Canvas } from './core/canvas'
import { Grid } from './core/grid'
import { GridBuilder } from './core/grid-builder'
import { WindowManager } from './menu/window-manager'

export class App {
  private static instance: App;
  private canvas: Canvas;
  private grid: Grid;
  private windowMngr: WindowManager;

  private constructor() {
    this.windowMngr = WindowManager.getInstance();
    this.canvas = Canvas.getInstance();
    this.grid = new GridBuilder().build();
    this.grid.createSheet();
  }

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
