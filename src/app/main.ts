import { Canvas } from './core/canvas'
import { WindowManager } from './menu/window-manager'
import { GridHandler } from './core/grid-handler';

export class App {
  private static instance: App;
  private canvas: Canvas;
  private windowMngr: WindowManager;
  private gridHanlder: GridHandler;

  private constructor() {
    this.windowMngr = WindowManager.getInstance();
    this.canvas = Canvas.getInstance();
    this.gridHanlder = GridHandler.getInstance();
  }

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
