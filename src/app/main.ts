import { Canvas } from './core/canvas'
import { Grid, GridBuilder } from './core/grid'
import { Menu } from './menu/menu'

export class App {
  private static instance: App;
  private canvas: Canvas;
  private grid: Grid;
  private menu: Menu;

  private constructor() {
    this.menu = Menu.getInstance();
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
